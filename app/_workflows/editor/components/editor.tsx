"use client";
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Background,
	type Connection,
	Controls,
	type Edge,
	type EdgeChange,
	MiniMap,
	type Node,
	type NodeChange,
	Panel,
	ReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { useSuspenseWorkflow } from "@/app/_workflows/hooks/use-workflows";
import { ErrorView, LoadingView } from "@/components/entity-components";

import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

export const Editor = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);
	const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
	const [edges, setEdges] = useState<Edge[]>(workflow.edges);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) =>
			setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
		[],
	);
	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) =>
			setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
		[],
	);
	const onConnect = useCallback(
		(params: Connection) =>
			setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	return (
		<div className="size-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				fitView
				nodeTypes={nodeComponents}
			>
				<Background />
				<Controls />
				<MiniMap />
				<Panel position="top-right">
					<AddNodeButton />
				</Panel>
			</ReactFlow>
		</div>
	);
};

export const EditorLoading = () => {
	return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
	return <ErrorView message="Error loading editor" />;
};
