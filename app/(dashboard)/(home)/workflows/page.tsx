import { requireAuth } from "@/lib/auth-utils";

async function WorkflowsPage() {
  await requireAuth();
  return <div>WorkflowsPage</div>;
}

export default WorkflowsPage;
