import type { NodeExecutor } from "@/app/_workflows/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
	context,
	step,
}) => {
	return await step.run("manual-trigger", async () => context);
};
