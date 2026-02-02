"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";

type UpgradeModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
					<AlertDialogDescription>
						Upgrade to Pro to get access to all features.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => authClient.checkout({ slug: "Flowie-Pro" })}
					>
						Upgrade now
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
