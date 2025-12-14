"use client";
import { useSuspenseWorkflow } from "@/app/_workflows/hooks/use-workflows";
import { ErrorView, LoadingView } from "@/components/entity-components";

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  return <p>{JSON.stringify(workflow, null, 2)}</p>;
};

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Error loading editor" />;
};
