import { Zap } from "lucide-react";

interface ConnectionStatusProps {
  connectionStatus: string;
}

export default function ConnectionStatus({
  connectionStatus,
}: ConnectionStatusProps) {
  return (
    <div className="flex gap-4 justify-center items-center prose prose-invert">
      <Zap height={20} width={20} className="text-primary" />
      <p className="mt-0 text-primary">{connectionStatus}</p>
    </div>
  );
}
