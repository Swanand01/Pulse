import { useParams } from "react-router-dom";
import { useFileSharing } from "@/hooks/useFileSharing";
import { useUsername } from "@/hooks/useUsername";
import DownloadDialog from "./DownloadDialog";
import NetworkGraph from "./NetworkGraph";
import RoomInfo from "./RoomInfo";
import SendFileButton from "./SendFileButton";
import ShareLinkAlert from "./ShareLink/ShareLinkAlert";
import { ShareLinkDialog } from "./ShareLink/ShareLinkDialog";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const { username, setUsername } = useUsername();

  const {
    connectionStatus,
    transferSpeed,
    sendFile,
    showDownloadDialog,
    setShowDownloadDialog,
    downloadData,
    handleDownload,
    peers,
  } = useFileSharing({ roomId: roomId || "", username, setUsername });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="relative flex-1 min-h-0 max-h-[55vh] sm:max-h-[65vh]">
        <div className="absolute inset-0 pointer-events-none [background:radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.07)_0%,transparent_70%)]" />
        <NetworkGraph
          users={[username, ...peers]}
          className="!h-full !w-full"
        />
      </div>

      <div className="flex justify-center px-6 py-4">
        {connectionStatus === "" ? (
          <ShareLinkAlert className="max-w-sm w-full" />
        ) : (
          <RoomInfo
            connectionStatus={connectionStatus}
            transferSpeed={transferSpeed}
          />
        )}
      </div>

      {connectionStatus !== "" && (
        <div className="flex justify-center items-center gap-2 pb-6 px-6 animate-in fade-in slide-in-from-bottom duration-500">
          <ShareLinkDialog />
          <SendFileButton sendFile={sendFile} disabled={false} />
        </div>
      )}

      {showDownloadDialog && (
        <DownloadDialog
          open={showDownloadDialog}
          setOpen={setShowDownloadDialog}
          filename={downloadData?.file.name ?? ""}
          onClickDownload={handleDownload}
        />
      )}
    </div>
  );
}
