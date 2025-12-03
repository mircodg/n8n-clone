import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

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

/**
 * Hook to create a new workflow
 */
export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow ${data.name} created successfully`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({
            limit: 10,
            offset: 0,
          })
        );
      },
      onError: (error) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    })
  );
};
