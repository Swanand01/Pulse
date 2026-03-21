import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface UserNodeProps {
  data: {
    label: string;
  };
}

export default function UserNode({ data }: UserNodeProps) {
  const textLength = data.label.length;
  let sizeClass = "w-14 h-14";

  if (textLength > 6 && textLength <= 16) {
    sizeClass = "w-18 h-18";
  } else if (textLength > 16) {
    sizeClass = "w-20 h-20";
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-background border-2 border-primary node-glow",
        sizeClass,
      )}
    >
      <p className="text-center mb-0 text-xs">{data.label}</p>
      <Handle
        type="source"
        className="invisible"
        position={Position.Top}
        id="a"
      />
      <Handle
        type="source"
        className="invisible"
        position={Position.Right}
        id="b"
      />
      <Handle
        type="source"
        className="invisible"
        position={Position.Bottom}
        id="c"
      />
      <Handle
        type="source"
        className="invisible"
        position={Position.Left}
        id="d"
      />
    </div>
  );
}
