import { useQueryStates } from "nuqs";
import { workflowsParams } from "@/app/_workflows/params";

export const useWorkflowParams = () => {
	return useQueryStates(workflowsParams);
};
