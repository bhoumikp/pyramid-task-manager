export type Task = {
	id: string;
	title: string;
	description: string | null;
	status: "TODO" | "DOING" | "COMPLETED" | "ON_HOLD";
	priority: "NONE" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
	startDate: string | null;
	dueDate: string | null;
	assignee: {
		id: string;
		name: string;
		avatarUrl: string | null;
	} | null;
};

export type TaskCol = {
	id: Task["status"];
	title: string;
	tasks: Task[];
};

export const taskPriorityLabels: Record<Task["priority"], string> = {
  NONE: "No Priority",
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  priority: "NONE" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  startDate?: string;
  dueDate?: string;
};

const taskStatuses: {
	id: Task["status"];
	title: string;
}[] = [
	{ id: "TODO", title: "To Do" },
	{ id: "DOING", title: "Doing" },
	{ id: "COMPLETED", title: "Completed" },
	{ id: "ON_HOLD", title: "On Hold" },
];

export function groupTasksByStatus(tasks: Task[]): TaskCol[] {
	return taskStatuses.map((status) => ({
		...status,
		tasks: tasks.filter((task) => task.status === status.id),
	}));
}

export function formatTaskDate(
  date: string | null,
  format: "short" | "long" = "long",
) {
	if (!date) return null;

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		...(format === "long" && { year: "numeric" }),
	}).format(new Date(date));
}