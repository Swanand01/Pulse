import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import WebTorrent, { type Torrent, type TorrentFile } from "webtorrent";
import { useToast } from "@/components/ui/use-toast";
import { TRACKERS } from "@/lib/constants";
import { download, formatBytes } from "../lib/utils";

interface UseFileSharingProps {
  roomId: string;
  username: string;
  setUsername: (value: string) => void;
}

interface UseFileSharingReturn {
  connectionStatus: string;
  transferSpeed: string;
  sendFile: (file: File) => void;
  showDownloadDialog: boolean;
  setShowDownloadDialog: React.Dispatch<React.SetStateAction<boolean>>;
  downloadData: { file: TorrentFile } | null;
  handleDownload: () => void;
  peers: string[];
}

export function useFileSharing({
  roomId,
  username,
  setUsername,
}: UseFileSharingProps): UseFileSharingReturn {
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const [webtorrent, setWebtorrent] = useState<WebTorrent | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("");
  const [torrentBeingSent, setTorrentBeingSent] = useState<Torrent | null>(
    null,
  );
  const [transferSpeed, setTransferSpeed] = useState("0 kB/s");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadData, setDownloadData] = useState<{
    file: TorrentFile;
  } | null>(null);
  const [peers, setPeers] = useState<string[]>([]);

  // null = not joined, string = the username we last successfully joined/renamed as
  const joinedUsernameRef = useRef<string | null>(null);

  const onUserConnected = useCallback((username: string) => {
    setPeers((peers) => Array.from(new Set([...peers, username])));
    setConnectionStatus("Connection established.");
  }, []);

  const onFileUploadComplete = useCallback(() => {
    setConnectionStatus("File sent.");
    setTransferSpeed("0 kB/s");
  }, []);

  const onFileDownloadComplete = useCallback(() => {
    setConnectionStatus("File received! Generating your download.");
    setTransferSpeed("0 kB/s");
  }, []);

  const onUploadingFile = useCallback(
    (filename: string, progress: number, uploadSpeed: string) => {
      setConnectionStatus(`Sending ${filename}: ${progress}%`);
      setTransferSpeed(uploadSpeed);
    },
    [],
  );

  const onDownloadingFile = useCallback(
    (progress: number, downloadSpeed: string) => {
      setConnectionStatus(`Receiving file: ${progress}%`);
      setTransferSpeed(downloadSpeed);
    },
    [],
  );

  const reset = useCallback(() => {
    if (torrentBeingSent) {
      torrentBeingSent.destroy();
      setTorrentBeingSent(null);
    }
    setConnectionStatus("");
    setTransferSpeed("0 kB/s");
  }, [torrentBeingSent]);

  const sendFile = useCallback(
    (fileToSend: File) => {
      const socket = socketRef.current;
      if (!fileToSend || !socket || !webtorrent) return;
      reset();
      setConnectionStatus("Preparing to send.");

      webtorrent.seed(fileToSend, (torrent: Torrent) => {
        setTorrentBeingSent(torrent);

        socket.emit("file-link", torrent.magnetURI, socket.id);

        torrent.on("upload", () => {
          const progress = Math.round(
            (torrent.uploaded / torrent.length) * 100,
          );
          const uploadSpeed = `${formatBytes(torrent.uploadSpeed)}/s`;

          if (progress >= 100) {
            onFileUploadComplete();
            return;
          }

          onUploadingFile(fileToSend.name, progress, uploadSpeed);
        });

        torrent.on("error", (error: Error) => {
          console.error("WebTorrent error:", error);
        });
      });
    },
    [webtorrent, onFileUploadComplete, onUploadingFile, reset],
  );

  const handleDownload = useCallback(async () => {
    if (downloadData?.file) {
      const file = downloadData.file;
      const blob = await file.blob();
      download(blob, file.name);
      setShowDownloadDialog(false);
    }
  }, [downloadData]);

  useEffect(() => {
    fetch("/api/ice-servers")
      .then((res) => res.json())
      .then((data) => {
        const wt = new WebTorrent({
          tracker: {
            announce: TRACKERS,
            rtcConfig: { iceServers: data.iceServers },
          },
        });
        setWebtorrent(wt);
      })
      .catch((err) => {
        console.error("Failed to fetch ICE servers, falling back:", err);
        setWebtorrent(new WebTorrent({ tracker: { announce: TRACKERS } }));
      });
  }, []);

  const hasUsername = !!username;

  useEffect(() => {
    if (!hasUsername) return;

    const SOCKET_URL = window.location.origin;

    joinedUsernameRef.current = null;
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [hasUsername]);

  useEffect(() => {
    if (!webtorrent) return;
    webtorrent.on("error", (error: Error) => {
      console.error("WebTorrent client error:", error);
    });
  }, [webtorrent]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !roomId || !username) return;

    const handleConnect = () => {
      joinedUsernameRef.current = username;
      socket.emit("join-room", roomId, username);
    };

    const handleUserConnected = (username: string) => {
      onUserConnected(username);
      socket.emit("connection-established", username);
    };

    const handleConnectionEstablished = (username: string) => {
      onUserConnected(username);
    };

    const handleFileLink = async (fileLink: string, senderId: string) => {
      console.log("file-link received, webtorrent ready:", !!webtorrent);
      if (!webtorrent) return;
      setConnectionStatus("Received magnet link.");

      const existing = await webtorrent.get(fileLink);
      if (existing) {
        webtorrent.remove(existing);
      }

      webtorrent.add(fileLink, (torrent: Torrent) => {
        setTorrentBeingSent(torrent);

        torrent.on("download", () => {
          const progress = Math.round(torrent.progress * 100);
          const downloadSpeed = `${formatBytes(torrent.downloadSpeed)}/s`;

          if (progress >= 100) {
            onFileDownloadComplete();
            return;
          }

          onDownloadingFile(progress, downloadSpeed);
        });

        torrent.on("done", async () => {
          onFileDownloadComplete();

          try {
            const file = torrent.files[0];
            setDownloadData({ file });
            setShowDownloadDialog(true);
          } catch (err) {
            console.error("Error generating download:", err);
          }

          socket.emit("done-downloading", senderId);
        });

        torrent.on("error", (err: Error) => {
          console.error("Torrent error:", err);
        });
      });
    };

    const handleDoneDownloading = () => {
      onFileUploadComplete();
    };

    const handleUserDisconnected = (username: string) => {
      setPeers((prev) => prev.filter((p) => p !== username));
      reset();
    };

    const handleUsernameTaken = () => {
      if (joinedUsernameRef.current !== null) {
        // Rename rejected — revert to the name we were joined as
        setUsername(joinedUsernameRef.current);
        toast({ title: "Username already taken.", variant: "destructive" });
      } else {
        // Initial join rejected
        toast({
          title: "Username already taken. Change your nickname to join.",
          variant: "destructive",
        });
      }
    };

    const handleRenameConfirmed = () => {
      joinedUsernameRef.current = username;
      toast({ title: "Nickname saved." });
    };

    const handleUserRenamed = (oldName: string, newName: string) => {
      setPeers((prev) => prev.map((p) => (p === oldName ? newName : p)));
    };

    socket.on("connect", handleConnect);
    socket.on("username-taken", handleUsernameTaken);
    socket.on("rename-confirmed", handleRenameConfirmed);
    socket.on("user-connected", handleUserConnected);
    socket.on("connection-established", handleConnectionEstablished);
    socket.on("file-link", handleFileLink);
    socket.on("done-downloading", handleDoneDownloading);
    socket.on("user-disconnected", handleUserDisconnected);
    socket.on("user-renamed", handleUserRenamed);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("username-taken", handleUsernameTaken);
      socket.off("rename-confirmed", handleRenameConfirmed);
      socket.off("user-connected", handleUserConnected);
      socket.off("connection-established", handleConnectionEstablished);
      socket.off("file-link", handleFileLink);
      socket.off("done-downloading", handleDoneDownloading);
      socket.off("user-disconnected", handleUserDisconnected);
      socket.off("user-renamed", handleUserRenamed);
    };
  }, [
    hasUsername,
    roomId,
    webtorrent,
    reset,
    username,
    onDownloadingFile,
    onFileDownloadComplete,
    onFileUploadComplete,
    onUserConnected,
    setUsername,
    toast,
  ]); // webtorrent kept in deps so handleFileLink closure stays fresh

  // Handle username changes: rename if already joined, rejoin if previous join was rejected
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !username) return;
    if (joinedUsernameRef.current === username) return;

    if (joinedUsernameRef.current === null && socket.connected) {
      // Previous join was rejected — try again with new username
      joinedUsernameRef.current = username;
      socket.emit("join-room", roomId, username);
    } else if (joinedUsernameRef.current !== null) {
      // Already joined — rename
      socket.emit("rename-user", username);
      // Don't update joinedUsernameRef until server confirms via rename-confirmed
    }
  }, [username, roomId, hasUsername]);

  return {
    connectionStatus,
    transferSpeed,
    sendFile,
    showDownloadDialog,
    setShowDownloadDialog,
    downloadData,
    handleDownload,
    peers,
  };
}
