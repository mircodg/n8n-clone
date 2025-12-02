"use client";
import { useSuspenseWorkflows } from "@/app/_workflows/hooks/use-workflows";
import { EnityContainer, EntityHeader } from "@/components/entity-components";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        onNew={() => {}}
        newButtonLabel="Create Workflow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};

export const WorkflowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EnityContainer
      header={<WorkflowsHeader />}
      pagination={<></>}
      search={<></>}
    >
      {children}
    </EnityContainer>
  );
};
