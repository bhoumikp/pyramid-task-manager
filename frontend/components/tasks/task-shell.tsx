"use client";

import { useEffect, useState } from "react";
import { TaskHeader } from "./task-header";
import { TaskContent } from "./tasks-content";
import { TasksProvider } from "@/contexts/tasks-context";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

export type TaskView = "board" | "list";

export function TaskShell() {
	const [view, setView] = useState<TaskView>("board");
	const { setItems } = useBreadcrumbs();

	useEffect(() => {
		setItems([
			{
				label: "Tasks",
				href: "/tasks",
			},
		]);

		return () => {
			setItems([]);
		};
	}, [setItems]);

	return (
		<TasksProvider>
			<div className="flex h-full min-h-0 flex-col p-2 gap-4">
				<TaskHeader view={view} onViewChange={setView} />			
				<TaskContent view={view} />
			</div>
		</TasksProvider>
	)
}
