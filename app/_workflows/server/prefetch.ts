import { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type getManyInput = inferInput<typeof trpc.workflows.getMany>;

/**
 * Prefetch the workflows list
 */
export const prefetchWorkflows = async (input: getManyInput) => {
	prefetch(trpc.workflows.getMany.queryOptions(input));
};

/**
 * Prefetch single workflow
 */
export const prefetchWorkflow = async (id: string) => {
	prefetch(trpc.workflows.getOne.queryOptions({ id }));
};
