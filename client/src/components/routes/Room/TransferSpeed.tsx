import { Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransferSpeedProps {
  transferSpeed: string;
}

export default function TransferSpeed({ transferSpeed }: TransferSpeedProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-16 w-16 rounded-full flex flex-col prose prose-invert"
          >
            <Gauge width={20} height={20} />
            <p className="mt-0">{transferSpeed}</p>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Transfer speed</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
