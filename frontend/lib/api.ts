import { CreateTaskInput, Task } from "./tasks";

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

export async function getTasks(): Promise<Task[]>  {
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

export async function createTask(data: CreateTaskInput) {
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