"use client";

import { useContext, useEffect, useState } from "react";

import {
	createComment,
	createSubtask,
	deleteComment,
	deleteSubtask,
	getCurrentUser,
	getTask,
	getWorkspaceMembers,
	toggleTaskWatch,
	updateSubtask,
	updateTask,
} from "@/lib/api";
import {
	type Subtask,
	type Task,
	type UserSummary,
} from "@/lib/tasks";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { TasksContext } from "@/contexts/tasks-context";

import { TaskDetailsHeader } from "./task-details-header";
import { TaskDetailsProperties } from "./task-details-properties";
import { TaskDetailsSubtasks } from "./task-details-subtasks";
import { TaskDetailsComments } from "./task-details-comments";
import { TaskDetailsSidebar } from "./task-details-sidebar";

export function TaskDetails({ taskId }: { taskId: string }) {
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [members, setMembers] = useState<UserSummary[]>([]);
	const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
	const { setItems } = useBreadcrumbs();
	const tasksCtx = useContext(TasksContext);

	// Editable states
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [titleInput, setTitleInput] = useState("");
	const [isEditingDesc, setIsEditingDesc] = useState(false);
	const [descInput, setDescInput] = useState("");

	// Date edit states
	const [startDateInput, setStartDateInput] = useState("");
	const [dueDateInput, setDueDateInput] = useState("");

	// Persistent Sidebar state
	const [showSidebar, setShowSidebar] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("pyramid_task_sidebar_visible");
			if (saved !== null) {
				return saved === "true";
			}
		}
		return true;
	});

	function handleToggleSidebar() {
		setShowSidebar((prev) => {
			const next = !prev;
			if (typeof window !== "undefined") {
				localStorage.setItem("pyramid_task_sidebar_visible", String(next));
			}
			return next;
		});
	}

	async function loadTaskData() {
		try {
			const [result, memberList, me] = await Promise.all([
				getTask(taskId),
				getWorkspaceMembers(),
				getCurrentUser(),
			]);
			setTask(result);
			setTitleInput(result.title);
			setDescInput(result.description || "");
			setStartDateInput(result.startDate ? result.startDate.split("T")[0] : "");
			setDueDateInput(result.dueDate ? result.dueDate.split("T")[0] : "");
			setMembers(memberList);
			setCurrentUser(me);
		} catch (error) {
			console.error("Failed to load task:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		void loadTaskData();
	}, [taskId]);

	useEffect(() => {
		if (!task) return;

		setItems([
			{ label: "Tasks", href: "/tasks" },
			{ label: task.title, href: `/tasks/${taskId}` },
		]);

		return () => setItems([]);
	}, [setItems, task, taskId]);

	// --- Mutation handlers ---

	async function handleUpdateTask(updates: Partial<Task> & { assigneeId?: string | null }) {
		if (!task) return;
		try {
			setTask((prev) => (prev ? { ...prev, ...updates } : null));
			const updated = await updateTask(taskId, updates);
			setTask(updated);
			if (tasksCtx?.refreshTasks) void tasksCtx.refreshTasks();
		} catch (error) {
			console.error("Failed to update task:", error);
			void loadTaskData();
		}
	}

	async function handleTogglePrivate() {
		if (!task) return;
		await handleUpdateTask({ isPrivate: !task.isPrivate });
	}

	async function handleToggleWatch() {
		if (!task) return;
		try {
			const updated = await toggleTaskWatch(taskId);
			setTask(updated);
		} catch (error) {
			console.error("Failed to toggle watch status:", error);
		}
	}

	async function handleSaveTitle() {
		if (!titleInput.trim() || titleInput === task?.title) {
			setIsEditingTitle(false);
			return;
		}
		setIsEditingTitle(false);
		await handleUpdateTask({ title: titleInput.trim() });
	}

	async function handleSaveDescription() {
		setIsEditingDesc(false);
		if (descInput === (task?.description || "")) return;
		await handleUpdateTask({ description: descInput.trim() || null });
	}

	async function handleAddSubtask(title: string) {
		try {
			const added = await createSubtask(taskId, {
				title,
				status: "TODO",
				priority: "NONE",
			});
			setTask((prev) =>
				prev ? { ...prev, subtasks: [...(prev.subtasks || []), added] } : null
			);
			void loadTaskData();
		} catch (error) {
			console.error("Failed to add subtask:", error);
		}
	}

	async function handleUpdateSubtaskStatus(subtaskId: string, status: Task["status"]) {
		try {
			await updateSubtask(taskId, subtaskId, { status });
			void loadTaskData();
		} catch (error) {
			console.error("Failed to update subtask status:", error);
		}
	}

	async function handleUpdateSubtaskPriority(subtaskId: string, priority: Task["priority"]) {
		try {
			await updateSubtask(taskId, subtaskId, { priority });
			void loadTaskData();
		} catch (error) {
			console.error("Failed to update subtask priority:", error);
		}
	}

	async function handleUpdateSubtaskAssignee(subtaskId: string, assigneeId: string | null) {
		try {
			await updateSubtask(taskId, subtaskId, { assigneeId });
			void loadTaskData();
		} catch (error) {
			console.error("Failed to update subtask assignee:", error);
		}
	}

	async function handleDeleteSubtask(subtaskId: string) {
		try {
			await deleteSubtask(taskId, subtaskId);
			setTask((prev) =>
				prev
					? { ...prev, subtasks: (prev.subtasks || []).filter((s) => s.id !== subtaskId) }
					: null
			);
		} catch (error) {
			console.error("Failed to delete subtask:", error);
		}
	}

	async function handlePostComment(content: string, parentId?: string) {
		try {
			await createComment(taskId, { content, parentId });
			void loadTaskData();
		} catch (error) {
			console.error("Failed to post comment:", error);
		}
	}

	async function handleDeleteComment(commentId: string) {
		try {
			await deleteComment(taskId, commentId);
			void loadTaskData();
		} catch (error) {
			console.error("Failed to delete comment:", error);
		}
	}

	// --- Render ---

	if (loading) {
		return <div className="p-4 text-sm text-muted-foreground">Loading task details...</div>;
	}

	if (!task) {
		return <div className="p-4 text-sm text-muted-foreground">Task not found.</div>;
	}

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 p-2">
			<TaskDetailsHeader
				task={task}
				isEditingTitle={isEditingTitle}
				titleInput={titleInput}
				isEditingDesc={isEditingDesc}
				descInput={descInput}
				showSidebar={showSidebar}
				onToggleSidebar={handleToggleSidebar}
				onTogglePrivate={() => void handleTogglePrivate()}
				onToggleWatch={() => void handleToggleWatch()}
				onTitleInputChange={setTitleInput}
				onSaveTitle={() => void handleSaveTitle()}
				onCancelTitle={() => setIsEditingTitle(false)}
				onStartEditTitle={() => setIsEditingTitle(true)}
				onDescInputChange={setDescInput}
				onSaveDescription={() => void handleSaveDescription()}
				onCancelDescription={() => {
					setDescInput(task.description || "");
					setIsEditingDesc(false);
				}}
				onStartEditDesc={() => setIsEditingDesc(true)}
			/>

			<div className={`grid grid-cols-1 gap-5 ${showSidebar ? "xl:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
				<main className="min-w-0 space-y-5">
					<TaskDetailsProperties
						task={task}
						members={members}
						dueDateInput={dueDateInput}
						onDueDateInputChange={setDueDateInput}
						onUpdateTask={(u) => void handleUpdateTask(u)}
					/>

					<TaskDetailsSubtasks
						subtasks={task.subtasks || []}
						members={members}
						onAddSubtask={(title) => void handleAddSubtask(title)}
						onUpdateStatus={(id, s) => void handleUpdateSubtaskStatus(id, s)}
						onUpdatePriority={(id, p) => void handleUpdateSubtaskPriority(id, p)}
						onUpdateAssignee={(id, a) => void handleUpdateSubtaskAssignee(id, a)}
						onDelete={(id) => void handleDeleteSubtask(id)}
					/>

					<TaskDetailsComments
						comments={task.comments || []}
						currentUser={task.createdBy}
						onPostComment={(c, p) => void handlePostComment(c, p)}
						onDeleteComment={(id) => void handleDeleteComment(id)}
					/>
				</main>

				{showSidebar && (
					<TaskDetailsSidebar
						task={task}
						members={members}
						activities={task.activities || []}
						currentUser={currentUser ?? tasksCtx?.currentUser}
						startDateInput={startDateInput}
						dueDateInput={dueDateInput}
						onStartDateInputChange={setStartDateInput}
						onDueDateInputChange={setDueDateInput}
						onUpdateTask={(u) => void handleUpdateTask(u)}
					/>
				)}
			</div>
		</div>
	);
}
