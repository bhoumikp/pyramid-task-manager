import type { Task } from "@/lib/tasks";

export const statusLabels: Record<Task["status"], string> = {
	TODO: "To Do",
	DOING: "Doing",
	COMPLETED: "Completed",
	ON_HOLD: "On Hold",
};

export const statusColors: Record<Task["status"], string> = {
	TODO: "text-muted-foreground bg-muted-foreground/10",
	DOING: "text-orange-500 bg-orange-500/10",
	COMPLETED: "text-emerald-500 bg-emerald-500/10",
	ON_HOLD: "text-amber-500 bg-amber-500/10",
};

export const priorityColorClass: Record<Task["priority"], string> = {
	NONE: "text-foreground",
	LOW: "text-gray-500",
	MEDIUM: "text-yellow-500",
	HIGH: "text-orange-500",
	URGENT: "text-red-500",
};
