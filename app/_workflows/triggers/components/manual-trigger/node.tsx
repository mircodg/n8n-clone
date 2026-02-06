import type { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { BaseTriggerNode } from "../../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [nodeStatus, setNodeStatus] = useState<NodeStatus>("initial");

	const handleOpenSettings = () => {
		setDialogOpen(true);
	};
	return (
		<>
			<ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
			<BaseTriggerNode
				{...props}
				icon={MousePointerIcon}
				name="When clicking 'Execute Workflow'"
				onSettings={handleOpenSettings}
				onDoubleClick={handleOpenSettings}
				status={nodeStatus}
			/>
		</>
	);
});

ManualTriggerNode.displayName = "ManualTriggerNode";
