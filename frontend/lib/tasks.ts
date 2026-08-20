export type UserSummary = {
	id: string;
	name: string;
	avatarUrl: string | null;
};

export type Subtask = {
	id: string;
	title: string;
	status: "TODO" | "DOING" | "COMPLETED" | "ON_HOLD";
	priority: "NONE" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
	dueDate: string | null;
	createdAt: string;
	assignee: UserSummary | null;
};

export type CommentReply = {
	id: string;
	content: string;
	createdAt: string;
	author: UserSummary;
};

export type CommentItem = {
	id: string;
	content: string;
	createdAt: string;
	author: UserSummary;
	replies?: CommentReply[];
};

export type TaskActivityItem = {
	id: string;
	message: string;
	type?: string;
	createdAt: string;
	actor: UserSummary;
};

export type Task = {
	id: string;
	title: string;
	description: string | null;
	status: "TODO" | "DOING" | "COMPLETED" | "ON_HOLD";
	priority: "NONE" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
	startDate: string | null;
	dueDate: string | null;
	labels?: string[];
	isPrivate?: boolean;
	assignee: UserSummary | null;
	createdBy: UserSummary;
	watchers?: UserSummary[];
	subtasks?: Subtask[];
	comments?: CommentItem[];
	activities?: TaskActivityItem[];
};

export type TaskCol = {
	id: Task["status"];
	title: string;
	tasks: Task[];
};

export type TaskField =
	| "status"
	| "priority"
	| "members"
	| "dueDate"
	| "labels"
	| "reporter";

export type TaskFieldState = Record<TaskField, boolean>;

export type CreateTaskInput = {
	title: string;
	description?: string;
	status?: Task["status"];
	priority: "NONE" | "URGENT" | "HIGH" | "MEDIUM" | "LOW";
	startDate?: string;
	dueDate?: string;
};

export type UpdateTaskInput = {
	title?: string;
	description?: string | null;
	status?: Task["status"];
	priority?: Task["priority"];
	assigneeId?: string | null;
	startDate?: string | null;
	dueDate?: string | null;
	labels?: string[];
	isPrivate?: boolean;
};

export type CreateSubtaskInput = {
	title: string;
	status?: Task["status"];
	priority?: Task["priority"];
	assigneeId?: string | null;
	dueDate?: string | null;
};

export type UpdateSubtaskInput = Partial<CreateSubtaskInput>;

export type CreateCommentInput = {
	content: string;
	parentId?: string;
};

export const taskPriorityLabels: Record<Task["priority"], string> = {
	NONE: "No Priority",
	URGENT: "Urgent",
	HIGH: "High",
	MEDIUM: "Medium",
	LOW: "Low",
};

export const taskStatusLabels: Record<Task["status"], string> = {
  TODO: "To Do",
  DOING: "Doing",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
};

export const taskFieldLabels: Record<TaskField, string> = {
	status: "Status",
	priority: "Priority",
	members: "Members",
	dueDate: "Due Date",
	labels: "Labels",
	reporter: "Reporter",
};

export const defaultTaskFields: TaskFieldState = {
	status: true,
	priority: true,
	members: true,
	dueDate: true,
	labels: true,
	reporter: true,
};

export const taskStatuses: {
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

export function formatRelativeTime(dateStr: string) {
	if (!dateStr) return "";
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSecs = Math.floor(diffMs / 1000);
	if (diffSecs < 60) return "just now";
	const diffMins = Math.floor(diffSecs / 60);
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 7) return `${diffDays}d ago`;
	return formatTaskDate(dateStr, "short") || "";
}
