"use client";

import { Dot, LucideIcon, Signal, SignalHigh, SignalLow, SignalMedium} from "lucide-react";
import { AppSearchBar } from "../app/app-search-bar";
import { AppFieldsDropdown } from "../app/app-fields-dropdown";
import { AppFilterDropdown } from "../app/app-filter-dropdwon";
import { AppAddDialogue } from "../app/app-add-dialogue";
import { TaskView } from "./task-shell";
import { Task, TaskField } from "@/lib/tasks";
import { useTasks } from "@/hooks/use-tasks";

const fields: TaskField[] = ["status", "priority", "members", "dueDate", "labels", "reporter"];

interface Filter {
	label: string,
	icon: LucideIcon,
	items: {
		label: string,
		value: Task["priority"],
		icon: LucideIcon,
		color?: string,
	}[]
}

const filters: Filter[] = [
	{
		label: "Priority",
		icon: Signal,
		items: [
			{
				label: "No Priority",
				value: "NONE",
				icon: Dot
			},
			{
				label: "Urgent",
				value: "URGENT",
				icon: Signal,
				color: "red-500"
			},
			{
				label: "High",
				value: "HIGH",
				icon: SignalHigh,
				color: "orange-500"
			},
			{
				label: "Medium",
				value: "MEDIUM",
				icon: SignalMedium,
				color: "yellow-500"
			},
			{
				label: "Low",
				value: "LOW",
				icon: SignalLow,
				color: "gray-500"
			},
		]
	},
]

export function TaskHeader(
	{ view, onViewChange } : 
	{ view: TaskView, onViewChange: (view: TaskView) => void; }
) {
	const {
		search,
		setSearch,
		priorityFilters,
		togglePriorityFilter,
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
				<AppFilterDropdown 
					filters={filters}
					priorityFilters={priorityFilters}
					onPriorityFilterToggle={togglePriorityFilter}
				/>
				<AppAddDialogue />
			</div>
		</div>
	)
}
