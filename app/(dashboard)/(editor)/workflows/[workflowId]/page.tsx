import { requireAuth } from "@/lib/auth-utils";

interface SpecificWorkflowPageProps {
  params: Promise<{ workflowId: string }>;
}

async function SpecificWorkflowPage({ params }: SpecificWorkflowPageProps) {
  await requireAuth();
  const { workflowId } = await params;
  return <div>WorkflowId: {workflowId}</div>;
}

export default SpecificWorkflowPage;
