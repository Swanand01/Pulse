import { useParams } from "react-router-dom";
import { useFileSharing } from "../../../hooks/useFileSharing";
import ShareLink from "./ShareLink";
import DownloadDialog from "./DownloadDialog";
import SendFileButton from "./SendFileButton";
import RoomInfo from "./RoomInfo";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    connectionStatus,
    numberOfPeers,
    transferSpeed,
    sendFile,
    showDownloadDialog,
    setShowDownloadDialog,
    downloadData,
    handleDownload,
  } = useFileSharing({ roomId: roomId || "" });

  return (
    <div className="w-full px-8 sm:w-96 sm:px-0 m-auto space-y-8">
      <RoomInfo
        connectionStatus={connectionStatus}
        numberOfPeers={numberOfPeers}
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
    </div>
  );
}
