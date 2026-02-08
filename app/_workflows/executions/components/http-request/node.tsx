"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog, type HttpRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
	endpoint?: string;
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: string;
	[key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [nodeStatus, setNodeStatus] = useState<NodeStatus>("initial");
	const { setNodes } = useReactFlow();

	const handleOpenSettings = () => {
		setDialogOpen(true);
	};

	const handleSubmit = (values: HttpRequestFormValues) => {
		setNodes((nodes) =>
			nodes.map((node) => {
				if (node.id === props.id) {
					return {
						...node,
						data: {
							...node.data,
							...values,
						},
					};
				}
				return node;
			}),
		);
	};
	const nodeData = props.data;
	const description = nodeData.endpoint
		? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
		: `Not configured`;

	return (
		<>
			<HttpRequestDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				onSubmit={handleSubmit}
				defaultValues={nodeData}
			/>
			<BaseExecutionNode
				{...props}
				id={props.id}
				icon={GlobeIcon}
				name="HTTP Request"
				description={description}
				onSettings={handleOpenSettings}
				onDoubleClick={handleOpenSettings}
				status={nodeStatus}
			/>
		</>
	);
});

HttpRequestNode.displayName = "HttpRequestNode";
