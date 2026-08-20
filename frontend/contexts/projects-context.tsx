"use client";

import { createContext, useEffect, useState } from "react";
import { getCurrentUser, getWorkspaceMembers } from "@/lib/api";
import {
	defaultProjectFields,
	initialProjects,
	type Project,
	type ProjectField,
	type ProjectFieldState,
} from "@/lib/projects";
import type { Task, UserSummary } from "@/lib/tasks";

export type CreateProjectInput = {
	title: string;
	description?: string;
	priority: Task["priority"];
	leadId?: string | null;
	startDate?: string | null;
	dueDate?: string | null;
};

type ProjectsContextValue = {
	projects: Project[];
	members: UserSummary[];
	currentUser: UserSummary | null;
	search: string;
	priorityFilters: Task["priority"][];
	leadFilters: string[];
	dueDateFilters: string[];
	visibleFields: ProjectFieldState;
	loading: boolean;
	setSearch: (search: string) => void;
	togglePriorityFilter: (priority: Task["priority"]) => void;
	toggleLeadFilter: (leadId: string) => void;
	toggleDueDateFilter: (dueDateKey: string) => void;
	clearAllFilters: () => void;
	toggleField: (field: ProjectField) => void;
	createProject: (input: CreateProjectInput) => void;
	updateProject: (id: string, updates: Partial<Project> & { leadId?: string | null }) => void;
	deleteProject: (id: string) => void;
};

export const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
	const [projects, setProjects] = useState<Project[]>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("pyramid_projects_data");
			if (saved) {
				try {
					return JSON.parse(saved);
				} catch (e) {
					console.error("Failed to parse saved projects", e);
				}
			}
		}
		return initialProjects;
	});

	const [members, setMembers] = useState<UserSummary[]>([]);
	const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);
	const [search, setSearch] = useState("");
	const [priorityFilters, setPriorityFilters] = useState<Task["priority"][]>([]);
	const [leadFilters, setLeadFilters] = useState<string[]>([]);
	const [dueDateFilters, setDueDateFilters] = useState<string[]>([]);

	const [visibleFields, setVisibleFields] = useState<ProjectFieldState>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("pyramid_project_visible_fields");
			if (saved) {
				try {
					return { ...defaultProjectFields, ...JSON.parse(saved) };
				} catch (e) {
					console.error("Failed to parse saved project visible fields", e);
				}
			}
		}
		return defaultProjectFields;
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function initData() {
			try {
				const [membersList, me] = await Promise.all([
					getWorkspaceMembers(),
					getCurrentUser(),
				]);
				setMembers(membersList);
				setCurrentUser(me);
			} catch (err) {
				console.error("Failed to load workspace members/current user", err);
			} finally {
				setLoading(false);
			}
		}

		void initData();
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("pyramid_projects_data", JSON.stringify(projects));
		}
	}, [projects]);

	function createProject(input: CreateProjectInput) {
		const leadUser = input.leadId
			? members.find((m) => m.id === input.leadId) ?? null
			: null;

		const newProj: Project = {
			id: `proj-${Date.now()}`,
			title: input.title,
			description: input.description,
			status: "PLANNING",
			priority: input.priority,
			lead: leadUser,
			startDate: input.startDate,
			dueDate: input.dueDate,
			createdAt: new Date().toISOString(),
		};

		setProjects((current) => [newProj, ...current]);
	}

	function updateProject(id: string, updates: Partial<Project> & { leadId?: string | null }) {
		setProjects((current) =>
			current.map((p) => {
				if (p.id !== id) return p;

				let updatedLead = p.lead;
				if (updates.leadId !== undefined) {
					updatedLead = updates.leadId
						? members.find((m) => m.id === updates.leadId) ?? null
						: null;
				}

				return {
					...p,
					...updates,
					lead: updatedLead,
				};
			})
		);
	}

	function deleteProject(id: string) {
		setProjects((current) => current.filter((p) => p.id !== id));
	}

	function togglePriorityFilter(priority: Task["priority"]) {
		setPriorityFilters((current) =>
			current.includes(priority) ? current.filter((p) => p !== priority) : [...current, priority]
		);
	}

	function toggleLeadFilter(leadId: string) {
		setLeadFilters((current) =>
			current.includes(leadId) ? current.filter((l) => l !== leadId) : [...current, leadId]
		);
	}

	function toggleDueDateFilter(dueDateKey: string) {
		setDueDateFilters((current) =>
			current.includes(dueDateKey) ? current.filter((d) => d !== dueDateKey) : [...current, dueDateKey]
		);
	}

	function clearAllFilters() {
		setPriorityFilters([]);
		setLeadFilters([]);
		setDueDateFilters([]);
	}

	function toggleField(field: ProjectField) {
		setVisibleFields((current) => {
			const next = {
				...current,
				[field]: !current[field],
			};
			if (typeof window !== "undefined") {
				localStorage.setItem("pyramid_project_visible_fields", JSON.stringify(next));
			}
			return next;
		});
	}

	return (
		<ProjectsContext.Provider
			value={{
				projects,
				members,
				currentUser,
				search,
				priorityFilters,
				leadFilters,
				dueDateFilters,
				visibleFields,
				loading,
				setSearch,
				togglePriorityFilter,
				toggleLeadFilter,
				toggleDueDateFilter,
				clearAllFilters,
				toggleField,
				createProject,
				updateProject,
				deleteProject,
			}}
		>
			{children}
		</ProjectsContext.Provider>
	);
}
