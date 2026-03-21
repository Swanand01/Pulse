import {
  ConnectionMode,
  type Edge,
  type Node,
  ReactFlow,
  type ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import SimpleFloatingEdge from "./FloatingEdge";
import UserNode from "./UserNode";

interface NetworkGraphProps {
  users: string[];
  className?: string;
}

const nodeTypes = {
  custom: UserNode,
};

const edgeTypes = {
  floating: SimpleFloatingEdge,
};

const createNodesAndEdges = (
  users: string[],
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const centerX = 250;
  const centerY = 250;
  const radius = 160;

  users.forEach((user, i) => {
    const angle = (i / users.length) * 2 * Math.PI;
    const x = users.length === 1 ? centerX : centerX + radius * Math.cos(angle);
    const y = users.length === 1 ? centerY : centerY + radius * Math.sin(angle);
    nodes.push({
      id: `${user}`,
      position: { x, y },
      data: { label: user },
      type: "custom",
    });
  });

  users.forEach((sourceUser, i) => {
    users.slice(i + 1).forEach((targetUser) => {
      edges.push({
        id: `${sourceUser}-${targetUser}`,
        source: `${sourceUser}`,
        target: `${targetUser}`,
        sourceHandle: `a`,
        targetHandle: `b`,
        type: "floating",
        animated: true,
        selectable: false,
        focusable: false,
      });
    });
  });

  return { nodes, edges };
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ users, className }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const onInit = useCallback((rf: ReactFlowInstance) => {
    setReactFlowInstance(rf);
  }, []);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(users);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [users, setNodes, setEdges]);

  useEffect(() => {
    if (reactFlowInstance) {
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.1 }), 50);
    }
  }, [reactFlowInstance, nodes]);

  return (
    <div className={cn("h-48 sm:h-64 sm:w-[500px]", className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        onInit={onInit}
        fitView
        colorMode="dark"
        elementsSelectable={false}
        nodesConnectable={false}
        panOnDrag={false}
        nodesDraggable={false}
        zoomOnPinch={false}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        style={{ background: "transparent" }}
      />
    </div>
  );
};

export default NetworkGraph;
