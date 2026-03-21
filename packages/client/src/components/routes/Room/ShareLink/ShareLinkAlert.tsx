import { cn } from "@/lib/utils";
import ShareLinkToolbar from "./ShareLinkToolbar";

interface ShareLinkAlertProps {
  className?: string;
}

export default function ShareLinkAlert({ className }: ShareLinkAlertProps) {
  return (
    <div
      className={cn(
        "bg-card/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl",
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Waiting for peers
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Share this link to connect with other devices
      </p>
      <ShareLinkToolbar />
    </div>
  );
}
