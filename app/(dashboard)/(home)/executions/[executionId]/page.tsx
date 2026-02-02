import { requireAuth } from "@/lib/auth-utils";

interface SpecificExecutionPageProps {
	params: Promise<{ executionId: string }>;
}

async function SpecificExecutionPage({ params }: SpecificExecutionPageProps) {
	await requireAuth();
	const { executionId } = await params;
	return <div>ExecutionId: {executionId}</div>;
}

export default SpecificExecutionPage;
