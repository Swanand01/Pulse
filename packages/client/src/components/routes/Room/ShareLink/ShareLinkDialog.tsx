import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShareLinkToolbar from "./ShareLinkToolbar";

export function ShareLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full px-6 gap-2 font-medium"
        >
          <Share2 className="h-4 w-4" />
          Share Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Room Link</DialogTitle>
          <DialogDescription className="text-sm">
            Share this link to devices you want to share files with
          </DialogDescription>
        </DialogHeader>
        <ShareLinkToolbar />
      </DialogContent>
    </Dialog>
  );
}
