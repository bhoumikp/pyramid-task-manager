"use client";

import { useState } from "react";
import { TaskColumn } from "./task-column";
import { TaskCol, TaskFieldState } from "@/lib/tasks";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";


type TaskBoardProps = {
  columns: TaskCol[];
  visibleFields: TaskFieldState;
  onColumnOrderChange: (
    activeId: TaskCol["id"],
    overId: TaskCol["id"],
  ) => void;
};

export function TaskBoard({
	columns,
	visibleFields,
	onColumnOrderChange,
}: TaskBoardProps) {
	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		onColumnOrderChange(
			active.id as TaskCol["id"],
			over.id as TaskCol["id"],
		);
	}

	return (
		<DndContext
			onDragStart={({ active }) => {
				setActiveColumnId(String(active.id));
			}}
			onDragCancel={() => {
				setActiveColumnId(null);
			}}
			onDragEnd={(event) => {
				handleDragEnd(event);
				setActiveColumnId(null);
			}}
			>
			<SortableContext
				items={columns.map((column) => column.id)}
				strategy={horizontalListSortingStrategy}
			>
				<div className="flex h-full min-w-0 gap-4 overflow-x-auto overflow-y-hidden">
				{columns.map((column) => (
					<TaskColumn
					key={column.id}
					columnData={column}
					visibleFields={visibleFields}
					/>
				))}
				</div>
			</SortableContext>

			<DragOverlay>
				{activeColumnId ? (
				 <div className="rotate-[1deg] opacity-95 shadow-lg">
					<TaskColumn
						columnData={columns.find(
							(column) => column.id === activeColumnId,
						)!}
						visibleFields={visibleFields}
					/>
				</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}
