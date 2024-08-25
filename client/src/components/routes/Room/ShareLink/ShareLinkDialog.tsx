import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import ShareLinkToolbar from "./ShareLinkToolbar";

export function ShareLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={
            "prose flex gap-3 items-center p-6 transition-transform duration-500 opacity-100 scale-105 hover:scale-110"
          }
        >
          <Share2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Room Link</DialogTitle>
          <DialogDescription className="prose prose-invert mb-2 text-sm">
            Share this link to devices you want to share files with
          </DialogDescription>
        </DialogHeader>
        <ShareLinkToolbar />
      </DialogContent>
    </Dialog>
  );
}
