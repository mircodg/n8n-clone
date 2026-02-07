import { manualTriggerExecutor } from "@/app/_workflows/triggers/components/manual-trigger/executor";
import { NodeType } from "@/drizzle/schema";
import { httpRequestExecutor } from "../components/http-request/executor";
import type { NodeExecutor } from "../types";

export const executorRegistry: Record<
	(typeof NodeType)[keyof typeof NodeType],
	NodeExecutor
> = {
	[NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
	[NodeType.INITIAL]: manualTriggerExecutor, // todo: implement initial executor
	[NodeType.HTTP_REQUEST]: httpRequestExecutor,
};

export const getExecutor = (
	nodeType: (typeof NodeType)[keyof typeof NodeType],
): NodeExecutor => {
	const executor = executorRegistry[nodeType];
	if (!executor) {
		throw new Error(`No executor found for node type: ${nodeType}`);
	}
	return executor;
};
