"use client";

import { getTasks } from "@/lib/api";
import { groupTasksByStatus, Task, TaskCol } from "@/lib/tasks";
import { useEffect, useState } from "react";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";
import { ClientOnly } from "../client-only";
import { TaskView } from "./task-shell";
import { useTasks } from "@/hooks/use-tasks";
import { arrayMove } from "@dnd-kit/sortable";

export function TaskContent({view} : { view: TaskView}) {
	const { tasks, loading } = useTasks();
	const taskCols = groupTasksByStatus(tasks);
	const [columnOrder, setColumnOrder] = useState<TaskCol["id"][]>([
		"TODO",
		"DOING",
		"COMPLETED",
		"ON_HOLD",
	]);
	const orderedColumns = columnOrder
		.map((columnId) =>
			taskCols.find((column) => column.id === columnId),
		)
		.filter((column): column is TaskCol => column !== undefined);

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
						<TaskBoard 
							columns={orderedColumns} 
							onColumnOrderChange={(activeId, overId) => {
								setColumnOrder((currentOrder) => {
									const oldIndex = currentOrder.indexOf(activeId);
									const newIndex = currentOrder.indexOf(overId);

									if (oldIndex === -1 || newIndex === -1) {
										return currentOrder;
									}

									return arrayMove(currentOrder, oldIndex, newIndex);
								});
							}}
						/>
					</ClientOnly>
				// </div>
			)}
		</div>
	)
}