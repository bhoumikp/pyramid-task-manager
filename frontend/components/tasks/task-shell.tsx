"use client";

import { useState } from "react";
import { TaskHeader } from "./task-header";
import { TaskContent } from "./tasks-content";

export type TaskView = "board" | "list";

export function TaskShell() {
	const [view, setView] = useState<TaskView>("board");

	return (
		<>
			<TaskHeader view={view} onViewChange={setView} />			
			<TaskContent view={view} />
		</>
	)
}