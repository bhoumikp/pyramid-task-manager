import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react";
import { TaskForm } from "../tasks/task-form";
import { useState } from "react";

export function AppAddDialogue() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button size={"lg"} className={"text-xs"}><Plus /> Add Task</Button>} />
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Task</DialogTitle>
					<DialogDescription>
						Create a new task for this workspace.
					</DialogDescription>
				</DialogHeader>
				
				<TaskForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}