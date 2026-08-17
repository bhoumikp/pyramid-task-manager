"use client";

import { useState } from "react";
import { TaskHeader } from "./task-header";
import { TaskContent } from "./tasks-content";
import { TasksProvider } from "@/contexts/tasks-context";

export type TaskView = "board" | "list";

export function TaskShell() {
	const [view, setView] = useState<TaskView>("board");

	return (
		<TasksProvider>
			<TaskHeader view={view} onViewChange={setView} />			
			<TaskContent view={view} />
		</TasksProvider>
	)
}