import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QRCodeDialog from "../QRCodeDialog";

export default function ShareLinkToolbar() {
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
    <div className="flex gap-2">
      <Button
        onClick={copyToClipboard}
        variant="outline"
        className="rounded-full flex-1"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
      <QRCodeDialog link={currentLink} className="flex-1" />
    </div>
  );
}
