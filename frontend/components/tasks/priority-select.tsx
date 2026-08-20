"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { taskPriorityLabels, type Task } from "@/lib/tasks";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { PriorityIcon } from "./details/priority-icon";
import { priorityColorClass } from "./details/task-details-constants";

interface PrioritySelectProps {
	priority: Task["priority"];
	onSelect: (priority: Task["priority"]) => void;
	trigger?: React.ReactElement;
	align?: "start" | "center" | "end";
	className?: string;
}

export function PrioritySelect({
	priority,
	onSelect,
	trigger,
	align = "start",
	className = "min-w-44 rounded-lg p-1",
}: PrioritySelectProps) {
	const defaultTrigger = (
		<div className="w-fit">
			<Button
				variant="ghost"
				size="sm"
				className={`h-6 justify-start gap-1 border-0 px-1 text-xs cursor-pointer ${priorityColorClass[priority]}`}
			>
				<PriorityIcon priority={priority} />
				{taskPriorityLabels[priority]}
				<ChevronDown className="size-3.5 text-foreground" />
			</Button>
		</div>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger nativeButton={false} render={trigger ?? defaultTrigger} />
			<DropdownMenuContent align={align} className={className}>
				<div className="px-2 py-2 text-xs text-muted-foreground font-medium">Priority</div>
				<DropdownMenuRadioGroup
					value={priority}
					onValueChange={(val) => onSelect(val as Task["priority"])}
				>
					<DropdownMenuRadioItem value="NONE" className="gap-2 px-3 py-2 text-sm text-foreground cursor-pointer">
						<PriorityIcon priority="NONE" />
						No Priority
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="URGENT" className="gap-2 px-3 py-2 text-sm text-red-500 cursor-pointer">
						<PriorityIcon priority="URGENT" />
						Urgent
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="HIGH" className="gap-2 px-3 py-2 text-sm text-orange-500 cursor-pointer">
						<PriorityIcon priority="HIGH" />
						High
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="MEDIUM" className="gap-2 px-3 py-2 text-sm text-yellow-500 cursor-pointer">
						<PriorityIcon priority="MEDIUM" />
						Medium
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="LOW" className="gap-2 px-3 py-2 text-sm text-gray-500 cursor-pointer">
						<PriorityIcon priority="LOW" />
						Low
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
