"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "@/components/workflow-node";

export const InitialNode = memo((props: NodeProps) => {
  return (
    <WorkflowNode showToolbar={false}>
      <PlaceholderNode {...props}>
        <div className="flex flex-col items-center justify-center cursor-pointer">
          <PlusIcon className="size-4" />
        </div>
      </PlaceholderNode>
    </WorkflowNode>
  );
});

InitialNode.displayName = "InitialNode";
