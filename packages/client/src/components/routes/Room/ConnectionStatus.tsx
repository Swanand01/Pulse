interface ConnectionStatusProps {
  connectionStatus: string;
}

export default function ConnectionStatus({
  connectionStatus,
}: ConnectionStatusProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2.5 rounded-full bg-primary/10 border border-primary/25 px-4 py-1.5 max-w-[55vw] sm:max-w-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <p className="text-sm text-primary font-medium truncate">
          {connectionStatus}
        </p>
      </div>
    </div>
  );
}
