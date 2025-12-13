import {
  WorkflowContainer,
  WorkflowError,
  WorkflowLoading,
  WorkflowsList,
} from "@/app/_workflows/components/workflows";
import { prefetchWorkflows } from "@/app/_workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { workflowsParamsLoader } from "@/app/_workflows/server/params-loader";
import { SearchParams } from "nuqs/server";

type WorkflowsPageProps = {
  searchParams: Promise<SearchParams>;
};

async function WorkflowsPage({ searchParams }: WorkflowsPageProps) {
  await requireAuth();
  const { page, pageSize, search } = await workflowsParamsLoader(searchParams);
  prefetchWorkflows({ page, pageSize, search });

  return (
    <WorkflowContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowError />}>
          <Suspense fallback={<WorkflowLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowContainer>
  );
}

export default WorkflowsPage;
