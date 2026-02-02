import {
	Editor,
	EditorError,
	EditorLoading,
} from "@/app/_workflows/editor/components/editor";
import { EditorHeader } from "@/app/_workflows/editor/components/editor-header";
import { prefetchWorkflow } from "@/app/_workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface SpecificWorkflowPageProps {
	params: Promise<{ workflowId: string }>;
}

async function SpecificWorkflowPage({ params }: SpecificWorkflowPageProps) {
	await requireAuth();
	const { workflowId } = await params;
	prefetchWorkflow(workflowId);
	return (
		<HydrateClient>
			<ErrorBoundary fallback={<EditorError />}>
				<Suspense fallback={<EditorLoading />}>
					<EditorHeader workflowId={workflowId} />
					<main className="flex-1">
						<Editor workflowId={workflowId} />
					</main>
				</Suspense>
			</ErrorBoundary>
		</HydrateClient>
	);
}

export default SpecificWorkflowPage;
