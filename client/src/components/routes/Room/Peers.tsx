import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface PeersProps {
  numberOfPeers: number;
}

export default function Peers({ numberOfPeers }: PeersProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="h-16 w-16 rounded-full flex flex-col prose dark:prose-invert"
          >
            <Users width={20} height={20} />
            <p className="mt-0">{numberOfPeers}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Peers connected</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
