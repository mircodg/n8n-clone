import type { NodeTypes } from "@xyflow/react";
import { HttpRequestNode } from "@/app/_workflows/executions/components/http-request/node";
import { ManualTriggerNode } from "@/app/_workflows/triggers/components/manual-trigger/node";
import { InitialNode } from "@/components/initial-node";
import { NodeType } from "@/drizzle/schema";

export const nodeComponents = {
	[NodeType.INITIAL]: InitialNode,
	[NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
	[NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
