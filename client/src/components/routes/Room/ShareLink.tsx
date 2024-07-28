import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import QRCodeDialog from "./QRCodeDialog";

export default function ShareLink() {
  const [copied, setCopied] = useState(false);
  const currentLink = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Alert>
      <AlertDescription>
        <p className="prose dark:prose-invert mb-2 text-sm text-muted-foreground">
          Share this link to devices you want to share files with
        </p>
        <div className="flex space-x-2">
          <Input readOnly value={currentLink} className="flex-grow" />
          <Button onClick={copyToClipboard} variant="outline">
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <QRCodeDialog link={currentLink} />
        </div>
      </AlertDescription>
    </Alert>
  );
}
