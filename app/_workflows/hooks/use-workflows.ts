import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = (
  limit: number = 10,
  offset: number = 0
) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.workflows.getMany.queryOptions({ limit, offset })
  );
};
