"use client";

import type { NodeProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import type { ReactNode } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
	icon: LucideIcon | string;
	name: string;
	description?: string;
	children?: ReactNode;
	onSettings?: () => void;
	onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
	({
		icon: Icon,
		name,
		description,
		children,
		onSettings,
		onDoubleClick,
	}: BaseTriggerNodeProps) => {
		const onDelete = () => {};
		return (
			<WorkflowNode
				name={name}
				description={description}
				onSettings={onSettings}
				onDelete={onDelete}
			>
				<BaseNode
					onDoubleClick={onDoubleClick}
					className="relative rounded-l-2xl group"
				>
					<BaseNodeContent>
						{typeof Icon == "string" ? (
							<Image src={Icon} alt={name} width={20} height={20} />
						) : (
							<Icon className="size-4 text-muted-foreground" />
						)}
						{children}
						<BaseHandle id="source-1" type="source" position={Position.Right} />
					</BaseNodeContent>
				</BaseNode>
			</WorkflowNode>
		);
	},
);

BaseTriggerNode.displayName = "BaseTriggerNode";
