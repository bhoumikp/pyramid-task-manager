"use client";

import { Ellipsis, GripVertical, Plus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { TaskCard } from "./task-card";
import { TaskCol } from "./task-data";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export function TaskColumn({ columnData, isDragging } : { columnData: TaskCol, isDragging?: boolean; }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({
		id: columnData.id,
	});


	return (
		<Card 
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			className={cn(
				"flex h-fit max-h-full min-h-0 w-[289px] shrink-0 flex-col gap-0 rounded-lg bg-muted p-0 border", 
				isDragging && "opacity-0"
			)}
		>
			<CardHeader className="flex shrink-0 justify-between rounded-t-lg p-3">
				<div className="flex gap-2 text-xs text-primary">
					<GripVertical 
						{...attributes}
  						{...listeners}
						className="cursor-grab active:cursor-grabbing" 
						size={14}
					/>
					<span className="font-semibold">{columnData.title}</span>
				</div>
				<div className="flex gap-2 text-xs text-primary">
					<Plus className="cursor-pointer" size={14}/>
					<Ellipsis className="cursor-pointer" size={14}/>
				</div>
			</CardHeader>

			<CardContent className="min-h-0 flex-1 overflow-y-auto px-2 py-1 space-y-2 no-scrollbar">
				{columnData.tasks.length > 0 ? (
					columnData.tasks.map((task) => (
						<TaskCard key={task.id} taskData={task} />
					))
					) : (
					<span className="text-center text-muted-foreground font-normal inline-block w-full py-4">
						No tasks added yet
					</span>
				)}
			</CardContent>

			<CardFooter className="shrink-0 border-0 bg-muted p-3">
				<Button 
					variant={"ghost"}
					size={"xs"}
					className={"border-0 rounded-3xl"}
				>
					<Plus />	
					Add Task
				</Button>
			</CardFooter>
		</Card>
	)
}