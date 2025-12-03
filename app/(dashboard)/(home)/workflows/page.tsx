import {
  WorkflowContainer,
  WorkflowsList,
} from "@/app/_workflows/components/workflows";
import { prefetchWorkflows } from "@/app/_workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

async function WorkflowsPage() {
  await requireAuth();
  prefetchWorkflows({ limit: 10, offset: 0 });

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<p>Error</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}

export default WorkflowsPage;
