import { cn } from "@/lib/utils";
import ConnectionStatus from "./ConnectionStatus";
import TransferSpeed from "./TransferSpeed";

interface RoomInfoProps {
  connectionStatus: string;
  transferSpeed: string;
  className?: string;
}

export default function RoomInfo({
  connectionStatus,
  transferSpeed,
  className,
}: RoomInfoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-500",
        className,
      )}
    >
      <ConnectionStatus connectionStatus={connectionStatus} />
      <TransferSpeed transferSpeed={transferSpeed} />
    </div>
  );
}
