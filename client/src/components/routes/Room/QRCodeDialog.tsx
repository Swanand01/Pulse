import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

interface QRCodeDialogProps {
  link: string;
}

export default function QRCodeDialog({ link }: QRCodeDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-fit rounded-lg">
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
