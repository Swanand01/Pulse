import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface QRCodeDialogProps {
  link: string;
  className?: string;
}

export default function QRCodeDialog({ link, className }: QRCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn("rounded-full", className)} variant="outline">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit rounded-2xl">
        <DialogHeader>
          <DialogTitle>Room QR code</DialogTitle>
          <DialogDescription className="prose prose-invert">
            Scan the QR code to join this room.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white">
          <QRCode value={link} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
