"use client";

import {
	createContext,
  useEffect,
  useState,
} from "react";

import { createTask, getTasks } from "@/lib/api";
import {
	defaultTaskFields,
	type Task,
	type TaskField,
	type TaskFieldState,
} from "@/lib/tasks";

type TasksContextValue = {
  tasks: Task[];
  search: string;
  priorityFilters: Task["priority"][];
  visibleFields: TaskFieldState;
  loading: boolean;
  setSearch: (search: string) => void;
  togglePriorityFilter: (priority: Task["priority"]) => void;
  toggleField: (field: TaskField) => void;
  createNewTask: (task: {
    title: string;
    description?: string;
    priority: Task["priority"];
    startDate?: string;
    dueDate?: string;
  }) => Promise<Task>;
};

export const TasksContext = createContext<TasksContextValue | undefined>(undefined,);

export function TasksProvider({
  	children,
}: {
  	children: React.ReactNode;
}) {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [search, setSearch] = useState("");
	const [priorityFilters, setPriorityFilters] = useState<Task["priority"][]>([]);
	const [visibleFields, setVisibleFields] = useState<TaskFieldState>(defaultTaskFields);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadTasks() {
			try {
				const result = await getTasks();
				setTasks(result);
			} catch (error) {
				console.error("Failed to fetch tasks:", error);
			} finally {
				setLoading(false);
			}
		}

		void loadTasks();
	}, []);

  	async function createNewTask(data: {
		title: string;
		description?: string;
		priority: Task["priority"];
		startDate?: string;
		dueDate?: string;
  	}) {
		const newTask = await createTask(data);

		setTasks((current) => [newTask, ...current]);

		return newTask;
  	}

	function togglePriorityFilter(priority: Task["priority"]) {
		setPriorityFilters((current) => {
			if (current.includes(priority)) {
				return current.filter((item) => item !== priority);
			}

			return [...current, priority];
		});
	}

	function toggleField(field: TaskField) {
		setVisibleFields((current) => ({
			...current,
			[field]: !current[field],
		}));
	}

  	return (
		<TasksContext.Provider
			value={{
				tasks,
				search,
				priorityFilters,
				visibleFields,
				loading,
				setSearch,
				togglePriorityFilter,
				toggleField,
				createNewTask,
			}}
		>
			{children}
		</TasksContext.Provider>
  	);
}
