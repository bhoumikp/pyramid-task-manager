"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ConfirmDeleteDialogProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	isDeleting?: boolean;
	onConfirm: () => void | Promise<void>;
	trigger?: React.ReactNode;
	nativeButton?: boolean;
}

export function ConfirmDeleteDialog({
	open,
	onOpenChange,
	title = "Are you sure you want to delete this?",
	description = "This action cannot be undone.",
	confirmText = "Delete",
	cancelText = "Cancel",
	isDeleting = false,
	onConfirm,
	trigger,
	nativeButton = true,
}: ConfirmDeleteDialogProps) {
	const [internalOpen, setInternalOpen] = React.useState(false);

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const handleOpenChange = onOpenChange ?? setInternalOpen;

	const handleConfirm = async () => {
		await onConfirm();
		handleOpenChange(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			{trigger && <DialogTrigger nativeButton={nativeButton} render={trigger as React.ReactElement} />}
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="gap-2">
					<div className="flex items-center gap-3">
						<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
							<AlertTriangle className="size-5" />
						</div>
						<DialogTitle className="text-base font-semibold">{title}</DialogTitle>
					</div>
					<DialogDescription className="text-muted-foreground">
						{description}
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="gap-2">
					<DialogClose
						render={
							<Button variant="outline" disabled={isDeleting}>
								{cancelText}
							</Button>
						}
					/>
					<Button
						variant="destructive"
						onClick={() => void handleConfirm()}
						disabled={isDeleting}
						className="cursor-pointer"
					>
						{isDeleting ? "Deleting..." : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
