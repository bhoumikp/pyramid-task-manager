"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { TaskHeader } from "../tasks/task-header";
import { TaskContent } from "../tasks/tasks-content";
import { TaskView } from "../tasks/task-shell";
import { TasksProvider } from "@/contexts/tasks-context";
import { useProjects } from "@/hooks/use-projects";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { ProjectsProvider } from "@/contexts/projects-context";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectTaskContent({ projectId }: { projectId: string }) {
	const [view, setView] = useState<TaskView>("board");
	const { setItems } = useBreadcrumbs();
	const { projects, loading } = useProjects();

	const project = projects.find((p) => p.id === projectId);

	useEffect(() => {
		if (loading || !project) return;

		if (typeof window !== "undefined") {
			const savedView = localStorage.getItem("pyramid_task_view");
			if (savedView === "board" || savedView === "list") {
				setView(savedView);
			}
		}

		setItems([
			{
				label: "Projects",
				href: "/projects",
			},
			{
				label: project.title,
				href: `/projects/${projectId}`,
			},
		]);

		return () => {
			setItems([]);
		};
	}, [setItems, projectId, project, loading]);

	if (loading) {
		return (
			<div className="flex h-full min-h-0 flex-col p-4 gap-4">
				<Skeleton className="h-8 w-48 rounded-md" />
				<Skeleton className="h-64 w-full rounded-md" />
			</div>
		);
	}

	if (!project) {
		notFound();
	}

	function handleViewChange(nextView: TaskView) {
		setView(nextView);
		if (typeof window !== "undefined") {
			localStorage.setItem("pyramid_task_view", nextView);
		}
	}

	return (
		<TasksProvider projectId={projectId}>
			<div className="flex h-full min-h-0 flex-col p-2 gap-4">
				<TaskHeader view={view} onViewChange={handleViewChange} title={project.title} />
				<TaskContent view={view} />
			</div>
		</TasksProvider>
	);
}

export function ProjectTaskShell({ projectId }: { projectId: string }) {
	return (
		<ProjectsProvider>
			<ProjectTaskContent projectId={projectId} />
		</ProjectsProvider>
	);
}
