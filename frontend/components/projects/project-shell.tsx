"use client";

import { useEffect } from "react";
import { ProjectHeader } from "./project-header";
import { ProjectTable } from "./project-table";
import { ProjectsProvider } from "@/contexts/projects-context";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

export function ProjectShell() {
	const { setItems } = useBreadcrumbs();

	useEffect(() => {
		setItems([
			{
				label: "Projects",
				href: "/projects",
			},
		]);

		return () => {
			setItems([]);
		};
	}, [setItems]);

	return (
		<ProjectsProvider>
			<div className="flex h-full min-h-0 flex-col p-2 gap-4 overflow-y-auto">
				<ProjectHeader />
				<ProjectTable />
			</div>
		</ProjectsProvider>
	);
}
