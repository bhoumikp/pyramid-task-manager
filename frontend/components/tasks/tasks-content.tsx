"use client";

import { getTasks } from "@/lib/api";
import { groupTasksByStatus, TaskCol } from "@/lib/tasks";
import { useEffect, useState } from "react";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";
import { ClientOnly } from "../client-only";
import { TaskView } from "./task-shell";

export function TaskContent({view} : { view: TaskView}) {
	const [taskCols, setTaskCols] = useState<TaskCol[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				setLoading(true);
				const result = await getTasks();
				setTaskCols(groupTasksByStatus(result));
			} catch(err) {
				console.log(err);
			} finally {
				setLoading(false);
			}
		}

		void fetchTasks()
	}, [])

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center">
				Loading tasks...
			</div>
		);
	}

	return (
		<div className="min-h-0 flex-1 overflow-y-auto p-2 no-scrollbar">
			{view==="list" ? (
				<TaskList columns={taskCols} />
			) : (
				// <div className="flex min-h-0 flex-1 flex-col gap-4 p-2 overflow-hidden">
					<ClientOnly>
						<TaskBoard columns={taskCols} onColumnsChange={setTaskCols} />
					</ClientOnly>
				// </div>
			)}
		</div>
	)
}