"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "@/components/workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
	const [selectorOpen, setSelectorOpen] = useState(false);
	return (
		<NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
			<WorkflowNode>
				<PlaceholderNode {...props} onClick={() => setSelectorOpen(true)}>
					<div className="flex flex-col items-center justify-center cursor-pointer">
						<PlusIcon className="size-4" />
					</div>
				</PlaceholderNode>
			</WorkflowNode>
		</NodeSelector>
	);
});

InitialNode.displayName = "InitialNode";
