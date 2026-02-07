import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "../../hooks/use-workflows";

export const ExecuteWorkflowButton = ({
	workflowId,
}: {
	workflowId: string;
}) => {
	const executeWorkflow = useExecuteWorkflow();

	const handleExecute = async () => {
		await executeWorkflow.mutateAsync({
			id: workflowId,
		});
	};
	return (
		<Button
			size="lg"
			onClick={handleExecute}
			disabled={executeWorkflow.isPending}
		>
			<FlaskConicalIcon className="size-4" />
			Execute Workflow
		</Button>
	);
};
