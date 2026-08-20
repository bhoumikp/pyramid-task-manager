"use client";

import { AppSearchBar } from "../app/app-search-bar";
import { AppFieldsDropdown } from "../app/app-fields-dropdown";
import { ProjectFilterDropdown } from "./project-filter-dropdown";
import { ProjectAddDialog } from "./project-add-dialog";
import { projectFieldLabels, type ProjectField } from "@/lib/projects";
import { useProjects } from "@/hooks/use-projects";

const fields: ProjectField[] = ["priority", "lead", "dueDate"];

export function ProjectHeader() {
	const {
		search,
		setSearch,
		visibleFields,
		toggleField,
	} = useProjects();

	return (
		<div className="flex justify-between items-center">
			<span className="font-semibold text-base">Projects</span>
			<div className="flex gap-2 items-center">
				<AppSearchBar
					value={search}
					onValueChange={setSearch}
				/>
				<AppFieldsDropdown
					fields={fields}
					visibleFields={visibleFields}
					fieldLabels={projectFieldLabels}
					onFieldToggle={toggleField}
				/>
				<ProjectFilterDropdown />
				<ProjectAddDialog />
			</div>
		</div>
	);
}
