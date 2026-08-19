"use client";

import { groupTasksByStatus, TaskCol } from "@/lib/tasks";
import { useState } from "react";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";
import { ClientOnly } from "../client-only";
import { TaskView } from "./task-shell";
import { useTasks } from "@/hooks/use-tasks";
import { arrayMove } from "@dnd-kit/sortable";

export function TaskContent({view} : { view: TaskView}) {
	const { tasks, loading, search, priorityFilters, visibleFields } = useTasks();
	const filteredTasks = tasks.filter((task) => {
		const query = search.trim().toLowerCase();
		const matchesSearch =
			query.length === 0 ||
			task.title.toLowerCase().includes(query) ||
			(task.description ?? "").toLowerCase().includes(query) ||
			(task.assignee?.name ?? "").toLowerCase().includes(query);

		const matchesPriority =
			priorityFilters.length === 0 ||
			priorityFilters.includes(task.priority);

		return matchesSearch && matchesPriority;
	});
	const taskCols = groupTasksByStatus(filteredTasks);
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
		<div className={`min-h-0 flex-1 ${view === "list" ? "overflow-y-auto" : "overflow-hidden"}`}>
			{view==="list" ? (
				<TaskList columns={taskCols} visibleFields={visibleFields} />
			) : (
				<ClientOnly>
					<TaskBoard 
						columns={orderedColumns} 
						visibleFields={visibleFields}
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
			)}
		</div>
	)
}
