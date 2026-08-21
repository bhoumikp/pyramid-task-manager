import { CreateProjectInput, Project } from "./projects";
import {
	CreateCommentInput,
	CreateSubtaskInput,
	CreateTaskInput,
	Subtask,
	Task,
	UpdateSubtaskInput,
	UpdateTaskInput,
	UserSummary,
} from "./tasks";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function loginAsGuest() {
	const response = await fetch(`${API_URL}/auth/guest`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to login as guest");
	}

	return response.json();
}

export async function getCurrentUser() {
	const response = await fetch(`${API_URL}/auth/me`, {
		credentials: "include",
	});

	if (!response.ok) {
		return null;
	}

	return response.json();
}

export async function updateProfileApi(data: {
	name?: string;
	username?: string;
	email?: string;
	title?: string;
	avatarUrl?: string;
}) {
	const response = await fetch(`${API_URL}/auth/me`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		throw new Error(err.message || "Failed to update profile");
	}

	return response.json();
}

export async function logoutApi() {
	const response = await fetch(`${API_URL}/auth/logout`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to logout");
	}

	return response.json();
}

export async function leaveWorkspaceApi() {
	const response = await fetch(`${API_URL}/auth/leave-workspace`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to leave workspace");
	}

	return response.json();
}

export async function getTasks(): Promise<Task[]> {
	const response = await fetch(`${API_URL}/tasks`, {
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch tasks");
	}

	return response.json();
}

export async function getTask(taskId: string): Promise<Task> {
	const response = await fetch(`${API_URL}/tasks/${taskId}`, {
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch task");
	}

	return response.json();
}

export async function createTask(data: CreateTaskInput): Promise<Task> {
	const response = await fetch(`${API_URL}/tasks`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to create task");
	}

	return response.json();
}

export async function updateTask(taskId: string, data: UpdateTaskInput): Promise<Task> {
	const response = await fetch(`${API_URL}/tasks/${taskId}`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update task");
	}

	return response.json();
}

export async function toggleTaskWatch(taskId: string): Promise<Task> {
	const response = await fetch(`${API_URL}/tasks/${taskId}/watch`, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to toggle task watch status");
	}

	return response.json();
}

export async function createSubtask(taskId: string, data: CreateSubtaskInput): Promise<Subtask> {
	const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to create subtask");
	}

	return response.json();
}

export async function updateSubtask(
	taskId: string,
	subtaskId: string,
	data: UpdateSubtaskInput,
): Promise<Subtask> {
	const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update subtask");
	}

	return response.json();
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<void> {
	const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks/${subtaskId}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to delete subtask");
	}
}

export async function createComment(taskId: string, data: CreateCommentInput) {
	const response = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to post comment");
	}

	return response.json();
}

export async function deleteComment(taskId: string, commentId: string): Promise<void> {
	const response = await fetch(`${API_URL}/tasks/${taskId}/comments/${commentId}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to delete comment");
	}
}

export async function getWorkspaceMembers(): Promise<UserSummary[]> {
	const response = await fetch(`${API_URL}/tasks/members`, {
		credentials: "include",
	});

	if (!response.ok) {
		return [];
	}

	return response.json();
}

export async function getProjects() {
	const response = await fetch(`${API_URL}/projects`, {
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch projects");
	}

	return response.json();
}

export async function createProjectApi(data: CreateProjectInput) {
	const response = await fetch(`${API_URL}/projects`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to create project");
	}

	return response.json();
}

export async function updateProjectApi(projectId: string, data: Partial<Project> & { leadId?: string | null }) {
	const response = await fetch(`${API_URL}/projects/${projectId}`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		throw new Error("Failed to update project");
	}

	return response.json();
}

export async function deleteProjectApi(projectId: string): Promise<void> {
	const response = await fetch(`${API_URL}/projects/${projectId}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to delete project");
	}
}