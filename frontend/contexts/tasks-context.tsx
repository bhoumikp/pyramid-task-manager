"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createTask, getTasks } from "@/lib/api";
import type { Task } from "@/lib/tasks";

type TasksContextValue = {
  tasks: Task[];
  loading: boolean;
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

  	return (
		<TasksContext.Provider
			value={{
				tasks,
				loading,
				createNewTask,
			}}
		>
			{children}
		</TasksContext.Provider>
  	);
}
