"use client";

import type { NodeProps } from "@xyflow/react";
import { Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { memo } from "react";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseExecutionNodeProps extends NodeProps {
	icon: LucideIcon | string;
	name: string;
	description?: string;
	children?: ReactNode;
	onSettings?: () => void;
	onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
	({
		icon: Icon,
		name,
		description,
		children,
		onSettings,
		onDoubleClick,
		id,
	}: BaseExecutionNodeProps) => {
		const { setNodes, setEdges } = useReactFlow();
		const handleDelete = () => {
			setNodes((currentNodes) => {
				return currentNodes.filter((node) => node.id !== id);
			});
			setEdges((currentEdges) => {
				return currentEdges.filter(
					(edge) => edge.source !== id && edge.target !== id,
				);
			});
		};
		return (
			<WorkflowNode
				name={name}
				description={description}
				onSettings={onSettings}
				onDelete={handleDelete}
			>
				<BaseNode onDoubleClick={onDoubleClick}>
					<BaseNodeContent>
						{typeof Icon === "string" ? (
							<Image src={Icon} alt={name} width={20} height={20} />
						) : (
							<Icon className="size-4 text-muted-foreground" />
						)}
						{children}
						<BaseHandle id="target-1" type="target" position={Position.Left} />
						<BaseHandle id="source-1" type="source" position={Position.Right} />
					</BaseNodeContent>
				</BaseNode>
			</WorkflowNode>
		);
	},
);

BaseExecutionNode.displayName = "BaseExecutionNode";
