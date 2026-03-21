import { Gauge } from "lucide-react";

interface TransferSpeedProps {
  transferSpeed: string;
}

export default function TransferSpeed({ transferSpeed }: TransferSpeedProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 border border-white/10 px-3 py-1.5 text-xs text-muted-foreground whitespace-nowrap shrink-0">
      <Gauge className="h-3.5 w-3.5" />
      <span>{transferSpeed}</span>
    </div>
  );
}
