import { Edge, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "./utils";

function FloatingEdge({ id, source, target, markerEnd, style }: Edge) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const edgePath = `M ${sx} ${sy} L ${tx} ${ty}`;

  return (
    <path
      id={id}
      d={edgePath}
      strokeWidth={5}
      markerEnd={markerEnd as string}
      style={style}
      className="react-flow__edge-path"
    />
  );
}

export default FloatingEdge;
