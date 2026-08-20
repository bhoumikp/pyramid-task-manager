import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import { TaskForm } from "../tasks/task-form";
import { useState } from "react";
import type { Task } from "@/lib/tasks";

export interface AppAddDialogueProps {
	initialStatus?: Task["status"];
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	nativeButton?: boolean;
}

export function AppAddDialogue({
	initialStatus,
	trigger,
	open,
	onOpenChange,
	nativeButton = true,
}: AppAddDialogueProps = {}) {
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;

	const triggerNode = trigger ?? (
		<Button className="text-xs">
			<Plus /> Add Task
		</Button>
	);

	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogTrigger nativeButton={nativeButton} render={triggerNode as React.ReactElement} />
			<DialogContent className="sm:max-w-xl p-6">
				<DialogHeader>
					<DialogTitle>Add Task</DialogTitle>
					<DialogDescription>
						Create a new task for this workspace.
					</DialogDescription>
				</DialogHeader>

				<TaskForm initialStatus={initialStatus} onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
