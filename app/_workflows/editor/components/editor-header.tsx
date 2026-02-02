"use client";

import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	useSuspenseWorkflow,
	useUpdateWorkflowName,
} from "../../hooks/use-workflows";

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
			<SidebarTrigger />
			<div className="flex flex-row items-center justify-between gap-x-4 w-full">
				<EditorBreadcrumb workflowId={workflowId} />
				<EditorSaveButton workflowId={workflowId} />
			</div>
		</header>
	);
};

export const EditorBreadcrumb = ({ workflowId }: { workflowId: string }) => {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/workflows" prefetch>
							Workflows
						</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<EditorNameInput workflowId={workflowId} />
			</BreadcrumbList>
		</Breadcrumb>
	);
};

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
	return (
		<div className="ml-auto">
			<Button size="sm" onClick={() => {}} disabled={false}>
				<SaveIcon className="size-4" />
				Save
			</Button>
		</div>
	);
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
	const { data: workflow } = useSuspenseWorkflow(workflowId);
	const updateWorkflowName = useUpdateWorkflowName();
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(workflow.name);

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (workflow.name && workflow.name !== name) {
			setName(workflow.name);
		}
	}, [workflow.name]);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	const handleSave = async () => {
		if (name === workflow.name) {
			setIsEditing(false);
			return;
		}

		try {
			await updateWorkflowName.mutateAsync({
				id: workflowId,
				name: name,
			});
		} catch {
			setName(workflow.name);
		} finally {
			setIsEditing(false);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			handleSave();
		} else if (event.key === "Escape") {
			setName(workflow.name);
			setIsEditing(false);
		}
	};

	if (isEditing) {
		return (
			<Input
				ref={inputRef}
				onKeyDown={handleKeyDown}
				value={name}
				onChange={(e) => setName(e.target.value)}
				onBlur={handleSave}
				className="h-7 w-auto min-w-[100px] px-2"
				disabled={updateWorkflowName.isPending}
			/>
		);
	}

	return (
		<BreadcrumbItem
			className="cursor-pointer hover:text-foreground transition-colors"
			onClick={() => setIsEditing(true)}
		>
			{workflow.name}
		</BreadcrumbItem>
	);
};
