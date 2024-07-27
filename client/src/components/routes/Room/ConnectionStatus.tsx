import { Zap } from "lucide-react";

interface ConnectionStatusProps {
  connectionStatus: string;
}

export default function ConnectionStatus({
  connectionStatus,
}: ConnectionStatusProps) {
  return (
    <div className="flex gap-4 justify-center items-center prose dark:prose-invert">
      <Zap height={20} width={20} />
      <p className="mt-0">{connectionStatus}</p>
    </div>
  );
}
