"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { ProjectForm } from "./project-form";
import { DialogTriggerProps } from "@base-ui/react";

export function ProjectAddDialog({ trigger, nativeButton }: { trigger?: React.ReactNode, nativeButton?: boolean }) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				nativeButton={nativeButton}
				render={
					(trigger || (
						<Button className="text-xs">
							<Plus size={14} />
							Add Project
						</Button>
					)) as React.ReactElement<DialogTriggerProps>
				}
			/>

			<DialogContent className="max-w-md p-6 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-base font-semibold">Create New Project</DialogTitle>
					<DialogDescription className="text-xs text-muted-foreground">
						Set up a new project workspace with lead assignment and timeline.
					</DialogDescription>
				</DialogHeader>

				<ProjectForm onSuccess={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}
