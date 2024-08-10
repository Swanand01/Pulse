import { useParams } from "react-router-dom";
import { useFileSharing } from "@/hooks/useFileSharing";
import ShareLink from "./ShareLink";
import DownloadDialog from "./DownloadDialog";
import SendFileButton from "./SendFileButton";
import RoomInfo from "./RoomInfo";
import useLocalStorage from "@/hooks/useLocalStorage";
import UsernameTakenDialog from "./UsernameTakenDialog";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [username] = useLocalStorage("username", "");

  const {
    connectionStatus,
    transferSpeed,
    sendFile,
    showDownloadDialog,
    setShowDownloadDialog,
    showUsernameTakenDialog,
    downloadData,
    handleDownload,
    peers,
  } = useFileSharing({ roomId: roomId || "", username });

  return (
    <div className="w-full px-8 sm:w-96 sm:px-0 m-auto space-y-8">
      {username}
      <br />
      peers:{peers}
      <RoomInfo
        connectionStatus={connectionStatus}
        transferSpeed={transferSpeed}
        className={connectionStatus === "" ? "hidden" : "block"}
      />
      <ShareLink
        className={`transition-transform duration-500 ${
          connectionStatus !== "" ? "translate-y-4" : "translate-y-0"
        }`}
      />
      <div className="absolute bottom-16 right-10">
        <SendFileButton
          sendFile={sendFile}
          disabled={connectionStatus === ""}
        />
      </div>
      {showDownloadDialog && (
        <DownloadDialog
          open={showDownloadDialog}
          setOpen={setShowDownloadDialog}
          filename={downloadData?.file.name}
          onClickDownload={handleDownload}
        />
      )}
      {showUsernameTakenDialog && (
        <UsernameTakenDialog
          open={showUsernameTakenDialog}
          username={username}
          roomId={roomId || ""}
        />
      )}
    </div>
  );
}
