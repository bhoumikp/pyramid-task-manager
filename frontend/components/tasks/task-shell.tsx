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
		if (typeof window !== "undefined") {
			const savedView = localStorage.getItem("pyramid_task_view");
			if (savedView === "board" || savedView === "list") {
				setView(savedView);
			}
		}

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

	function handleViewChange(nextView: TaskView) {
		setView(nextView);
		if (typeof window !== "undefined") {
			localStorage.setItem("pyramid_task_view", nextView);
		}
	}

	return (
		<TasksProvider>
			<div className="flex h-full min-h-0 flex-col p-2 gap-4">
				<TaskHeader view={view} onViewChange={handleViewChange} />			
				<TaskContent view={view} />
			</div>
		</TasksProvider>
	)
}
