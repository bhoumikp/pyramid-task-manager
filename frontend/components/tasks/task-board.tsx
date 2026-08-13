"use client";

import { useState } from "react";
import { TaskColumn } from "./task-column";
import { taskCols } from "./task-data";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";


export function TaskBoard() {
	const [columns, setColumns] = useState(taskCols);
	const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		setColumns((current) => {
			const oldIndex = current.findIndex(
			(column) => column.id === active.id,
			);

			const newIndex = current.findIndex(
			(column) => column.id === over.id,
			);

			if (oldIndex === -1 || newIndex === -1) {
			return current;
			}

			return arrayMove(current, oldIndex, newIndex);
		});
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
				<div className="flex h-full min-w-0 gap-4 overflow-x-auto overflow-y-hidden no-scrollbar">
				{columns.map((column) => (
					<TaskColumn
					key={column.id}
					columnData={column}
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
					/>
				</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}

