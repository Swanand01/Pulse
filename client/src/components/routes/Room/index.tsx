import { useParams } from "react-router-dom";
import Peers from "./Peers";
import TransferSpeed from "./TransferSpeed";
import ConnectionStatus from "./ConnectionStatus";
import FileCard from "./FileCard";
import { useFileSharing } from "../../../hooks/useFileSharing";
import ShareLink from "./ShareLink";
import DownloadDialog from "./DownloadDialog";

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
      <ConnectionStatus connectionStatus={connectionStatus} />
      {showDownloadDialog && (
        <DownloadDialog
          open={showDownloadDialog}
          setOpen={setShowDownloadDialog}
          filename={downloadData?.file.name}
          onClickDownload={handleDownload}
        />
      )}
      <FileCard sendFile={sendFile} />
      <div className="flex gap-4 justify-center">
        <Peers numberOfPeers={numberOfPeers} />
        <TransferSpeed transferSpeed={transferSpeed} />
      </div>
      <ShareLink />
    </div>
  );
}
