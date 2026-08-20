"use client";

import { groupTasksByStatus, TaskCol } from "@/lib/tasks";
import { useState } from "react";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";
import { ClientOnly } from "../client-only";
import { TaskView } from "./task-shell";
import { useTasks } from "@/hooks/use-tasks";
import { arrayMove } from "@dnd-kit/sortable";
import { Skeleton } from "../ui/skeleton";

function matchesDueDateFilter(dueDateStr: string | null | undefined, filterKeys: string[]): boolean {
	if (filterKeys.length === 0) return true;
	if (!dueDateStr) return filterKeys.includes("no_due_date");

	const due = new Date(dueDateStr);
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	const endOfWeek = new Date(startOfToday);
	endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
	endOfWeek.setHours(23, 59, 59, 999);

	return filterKeys.some((key) => {
		if (key === "no_due_date") return !dueDateStr;
		if (key === "overdue") return due < startOfToday;
		if (key === "today") return due >= startOfToday && due <= endOfToday;
		if (key === "this_week") return due >= startOfToday && due <= endOfWeek;
		return false;
	});
}

export function TaskContent({ view }: { view: TaskView }) {
	const {
		tasks,
		loading,
		search,
		statusFilters,
		priorityFilters,
		memberFilters,
		reporterFilters,
		labelFilters,
		dueDateFilters,
		visibleFields,
	} = useTasks();

	const filteredTasks = tasks.filter((task) => {
		const query = search.trim().toLowerCase();
		const matchesSearch =
			query.length === 0 ||
			task.title.toLowerCase().includes(query) ||
			(task.description ?? "").toLowerCase().includes(query) ||
			(task.assignee?.name ?? "").toLowerCase().includes(query) ||
			(task.createdBy?.name ?? "").toLowerCase().includes(query);

		const matchesStatus =
			statusFilters.length === 0 ||
			statusFilters.includes(task.status);

		const matchesPriority =
			priorityFilters.length === 0 ||
			priorityFilters.includes(task.priority);

		const matchesMember =
			memberFilters.length === 0 ||
			(memberFilters.includes("unassigned") && !task.assignee) ||
			(task.assignee && memberFilters.includes(task.assignee.id));

		const matchesReporter =
			reporterFilters.length === 0 ||
			(task.createdBy && reporterFilters.includes(task.createdBy.id));

		const matchesLabel =
			labelFilters.length === 0 ||
			(task.labels && task.labels.some((l) => labelFilters.includes(l)));

		const matchesDueDate = matchesDueDateFilter(task.dueDate, dueDateFilters);

		return (
			matchesSearch &&
			matchesStatus &&
			matchesPriority &&
			matchesMember &&
			matchesReporter &&
			matchesLabel &&
			matchesDueDate
		);
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
			<div className="flex h-full min-h-0 flex-col p-4 gap-4">
				<Skeleton className="h-8 w-48 rounded-md" />
				<Skeleton className="h-64 w-full rounded-md" />
			</div>
		);
	}

	return (
		<div className={`min-h-0 flex-1 ${view === "list" ? "overflow-y-auto" : "overflow-hidden"}`}>
			{view === "list" ? (
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
