"use client";

import { Dot, LucideIcon, Signal, SignalHigh, SignalLow, SignalMedium} from "lucide-react";
import { AppSearchBar } from "../app/app-search-bar";
import { AppFieldsDropdown } from "../app/app-fields-dropdown";
import { AppFilterDropdown } from "../app/app-filter-dropdwon";
import { AppAddDialogue } from "../app/app-add-dialogue";
import { Dispatch, SetStateAction } from "react";
import { TaskView } from "./task-shell";

const fields = ["Status", "Priority", "Members", "Due Date", "Labels", "Reporter"];

interface Filter {
	label: string,
	icon: LucideIcon,
	items: {
		label: string,
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
				icon: Dot
			},
			{
				label: "Urgent",
				icon: Signal,
				color: "red-500"
			},
			{
				label: "High",
				icon: SignalHigh,
				color: "orange-500"
			},
			{
				label: "Medium",
				icon: SignalMedium,
				color: "yellow-500"
			},
			{
				label: "Low",
				icon: SignalLow,
				color: "gray-500"
			},
		]
	},
]

export function TaskHeader({ view, onViewChange } : { view: TaskView, onViewChange: (view: TaskView) => void; }) {
	return (
		<div className="flex justify-between">
			<span className="font-semibold">Tasks</span>
			<div className="flex gap-2">
				<AppSearchBar />	
				<AppFieldsDropdown fields={fields} view={view} onViewChange={onViewChange}/>	
				<AppFilterDropdown filters={filters}/>
				<AppAddDialogue />
			</div>
		</div>
	)
}