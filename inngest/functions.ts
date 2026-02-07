import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";
import { getExecutor } from "@/app/_workflows/executions/lib/executor-registry";
import { topologicalSort } from "@/app/api/inngest/utils";
import { db } from "@/drizzle/db";
import { type NodeType, workflow } from "@/drizzle/schema";
import { inngest } from "./client";

const executeWorkflow = inngest.createFunction(
	{ id: "execute-workflow" },
	{ event: "workflows/execute.workflow" },
	async ({ event, step }) => {
		const workflowId = event.data.workflowId;
		if (!workflowId) {
			throw new NonRetriableError("Workflow ID is required");
		}
		const sortedNodes = await step.run("get-workflow-nodes", async () => {
			const result = await db.query.workflow.findFirst({
				where: eq(workflow.id, workflowId),
				with: {
					nodes: true,
					connections: true,
				},
			});

			if (!result) {
				throw new NonRetriableError("Workflow not found");
			}

			return topologicalSort(result.nodes, result.connections);
		});

		// Initialize the context with any initial data from the trigger
		let context = event.data.initialData || {};

		// Execute each node in order
		for (const node of sortedNodes) {
			const executor = getExecutor(
				node.type as (typeof NodeType)[keyof typeof NodeType],
			);
			context = await executor({
				data: node.data as Record<string, unknown>,
				nodeId: node.id,
				context,
				step,
			});
		}

		return {
			workflowId,
			result: context,
		};
	},
);

export const inngestFunctions = [executeWorkflow];
