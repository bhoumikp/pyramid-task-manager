"use client";

import { AppSearchBar } from "../app/app-search-bar";
import { AppFieldsDropdown } from "../app/app-fields-dropdown";
import { AppFilterDropdown } from "../app/app-filter-dropdwon";
import { AppAddDialogue } from "../app/app-add-dialogue";
import { TaskView } from "./task-shell";
import { TaskField } from "@/lib/tasks";
import { useTasks } from "@/hooks/use-tasks";

const fields: TaskField[] = ["status", "priority", "members", "dueDate", "labels", "reporter"];

export function TaskHeader(
	{ view, onViewChange } : 
	{ view: TaskView, onViewChange: (view: TaskView) => void; }
) {
	const {
		search,
		setSearch,
		visibleFields,
		toggleField,
	} = useTasks();

	return (
		<div className="flex justify-between">
			<span className="font-semibold">Tasks</span>
			<div className="flex gap-2">
				<AppSearchBar
					value={search}
					onValueChange={setSearch}
				/>	
				<AppFieldsDropdown 
					fields={fields} 
					visibleFields={visibleFields}
					view={view} 
					onViewChange={onViewChange}
					onFieldToggle={toggleField}
				/>	
				<AppFilterDropdown />
				<AppAddDialogue />
			</div>
		</div>
	)
}
