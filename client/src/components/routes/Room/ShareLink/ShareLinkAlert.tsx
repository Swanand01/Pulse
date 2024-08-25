import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import ShareLinkToolbar from "./ShareLinkToolbar";

interface ShareLinkAlertProps {
  className?: string;
}

export default function ShareLinkAlert({ className }: ShareLinkAlertProps) {
  return (
    <Alert className={cn("", className)}>
      <AlertDescription>
        <p className="prose prose-invert mb-2 text-sm">
          Share this link to devices you want to share files with
        </p>
        <ShareLinkToolbar />
      </AlertDescription>
    </Alert>
  );
}
