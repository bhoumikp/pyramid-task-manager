"use client";

import {
	createContext,
	useEffect,
	useState,
} from "react";

import { createTask, getCurrentUser, getTasks, getWorkspaceMembers, updateTask } from "@/lib/api";
import {
	defaultTaskFields,
	type CreateTaskInput,
	type Task,
	type TaskField,
	type TaskFieldState,
	type UpdateTaskInput,
	type UserSummary,
} from "@/lib/tasks";

type TasksContextValue = {
	tasks: Task[];
	members: UserSummary[];
	currentUser: UserSummary | null;
	search: string;
	statusFilters: Task["status"][];
	priorityFilters: Task["priority"][];
	memberFilters: string[];
	reporterFilters: string[];
	labelFilters: string[];
	dueDateFilters: string[];
	visibleFields: TaskFieldState;
	loading: boolean;
	projectId?: string;
	setSearch: (search: string) => void;
	toggleStatusFilter: (status: Task["status"]) => void;
	togglePriorityFilter: (priority: Task["priority"]) => void;
	toggleMemberFilter: (memberId: string) => void;
	toggleReporterFilter: (reporterId: string) => void;
	toggleLabelFilter: (label: string) => void;
	toggleDueDateFilter: (dueDateKey: string) => void;
	clearAllFilters: () => void;
	toggleField: (field: TaskField) => void;
	createNewTask: (task: CreateTaskInput) => Promise<Task>;
	updateExistingTask: (taskId: string, updates: UpdateTaskInput) => Promise<Task>;
	refreshTasks: () => Promise<void>;
};

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({
	children,
	projectId,
}: {
	children: React.ReactNode;
	projectId?: string;
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [members, setMembers] = useState<UserSummary[]>([]);
	const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
	const [search, setSearch] = useState("");
	const [statusFilters, setStatusFilters] = useState<Task["status"][]>([]);
	const [priorityFilters, setPriorityFilters] = useState<Task["priority"][]>([]);
	const [memberFilters, setMemberFilters] = useState<string[]>([]);
	const [reporterFilters, setReporterFilters] = useState<string[]>([]);
	const [labelFilters, setLabelFilters] = useState<string[]>([]);
	const [dueDateFilters, setDueDateFilters] = useState<string[]>([]);

	const [visibleFields, setVisibleFields] = useState<TaskFieldState>(defaultTaskFields);
	const [loading, setLoading] = useState(true);

	async function loadTasks() {
		try {
			const [result, membersList, me] = await Promise.all([
				getTasks(),
				getWorkspaceMembers(),
				getCurrentUser(),
			]);
			let filteredTasks = result;
			if (projectId) {
				filteredTasks = result.filter((t) => t.projectId === projectId);
			}
			setTasks(filteredTasks);
			setMembers(membersList);
			setCurrentUser(me);
		} catch (error) {
			console.error("Failed to fetch tasks/members:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void loadTasks();

		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("pyramid_task_visible_fields");
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					setVisibleFields((prev) => ({ ...prev, ...parsed }));
				} catch (error) {
					console.error("Failed to parse saved visible fields:", error);
				}
			}
		}
	}, [projectId]);

	async function createNewTask(data: CreateTaskInput) {
		const payload = {
			...data,
			...(projectId && !data.projectId ? { projectId } : {}),
		};

		const newTask = await createTask(payload);

		setTasks((current) => [newTask, ...current]);

		return newTask;
	}

	async function updateExistingTask(taskId: string, updates: UpdateTaskInput) {
		const updated = await updateTask(taskId, updates);
		setTasks((current) =>
			current.map((t) => (t.id === taskId ? updated : t))
		);
		return updated;
	}

	function toggleStatusFilter(status: Task["status"]) {
		setStatusFilters((current) =>
			current.includes(status) ? current.filter((s) => s !== status) : [...current, status]
		);
	}

	function togglePriorityFilter(priority: Task["priority"]) {
		setPriorityFilters((current) =>
			current.includes(priority) ? current.filter((p) => p !== priority) : [...current, priority]
		);
	}

	function toggleMemberFilter(memberId: string) {
		setMemberFilters((current) =>
			current.includes(memberId) ? current.filter((m) => m !== memberId) : [...current, memberId]
		);
	}

	function toggleReporterFilter(reporterId: string) {
		setReporterFilters((current) =>
			current.includes(reporterId) ? current.filter((r) => r !== reporterId) : [...current, reporterId]
		);
	}

	function toggleLabelFilter(label: string) {
		setLabelFilters((current) =>
			current.includes(label) ? current.filter((l) => l !== label) : [...current, label]
		);
	}

	function toggleDueDateFilter(dueDateKey: string) {
		setDueDateFilters((current) =>
			current.includes(dueDateKey) ? current.filter((d) => d !== dueDateKey) : [...current, dueDateKey]
		);
	}

	function clearAllFilters() {
		setStatusFilters([]);
		setPriorityFilters([]);
		setMemberFilters([]);
		setReporterFilters([]);
		setLabelFilters([]);
		setDueDateFilters([]);
	}

	function toggleField(field: TaskField) {
		setVisibleFields((current) => {
			const next = {
				...current,
				[field]: !current[field],
			};
			if (typeof window !== "undefined") {
				localStorage.setItem("pyramid_task_visible_fields", JSON.stringify(next));
			}
			return next;
		});
	}

	return (
		<TasksContext.Provider
			value={{
				tasks,
				members,
				currentUser,
				search,
				statusFilters,
				priorityFilters,
				memberFilters,
				reporterFilters,
				labelFilters,
				dueDateFilters,
				visibleFields,
				loading,
				projectId,
				setSearch,
				toggleStatusFilter,
				togglePriorityFilter,
				toggleMemberFilter,
				toggleReporterFilter,
				toggleLabelFilter,
				toggleDueDateFilter,
				clearAllFilters,
				toggleField,
				createNewTask,
				updateExistingTask,
				refreshTasks: loadTasks,
			}}
		>
			{children}
		</TasksContext.Provider>
	);
}
