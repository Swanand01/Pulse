import React, { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  type Node,
  type Edge,
  ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import SimpleFloatingEdge from "./FloatingEdge";
import UserNode from "./UserNode";

interface NetworkGraphProps {
  users: string[];
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
  const radius = 100;

  users.forEach((user, i) => {
    const angle = (i / users.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
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

const styles = {
  background: "#121417",
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ users }) => {
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
      reactFlowInstance.fitView();
    }
  }, [reactFlowInstance, nodes]);

  return (
    <div className="h-48 sm:h-64">
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
        style={styles}
      />
    </div>
  );
};

export default NetworkGraph;
