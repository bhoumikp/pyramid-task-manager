"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import type { Task } from "@/lib/tasks";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { statusColors, statusLabels } from "./details/task-details-constants";

interface StatusSelectProps {
	status: Task["status"];
	onSelect: (status: Task["status"]) => void;
	trigger?: React.ReactElement;
	align?: "start" | "center" | "end";
	nativeButton?: boolean;
	className?: string;
}

export function StatusSelect({
	status,
	onSelect,
	trigger,
	align = "start",
	nativeButton = true,
	className = "min-w-44 rounded-lg p-1",
}: StatusSelectProps) {
	const defaultTrigger = (
		<Button
			variant="ghost"
			size="sm"
			className={`h-6 justify-start gap-2 border-0 text-xs font-medium cursor-pointer ${statusColors[status]}`}
		>
			<span className="size-2 rounded-full bg-current" />
			{statusLabels[status]}
			<ChevronDown className="size-3.5" />
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger nativeButton={nativeButton} render={trigger ?? defaultTrigger} />
			<DropdownMenuContent align={align} className={className}>
				<div className="px-2 py-2 text-xs text-muted-foreground font-medium">Status</div>
				<DropdownMenuRadioGroup
					value={status}
					onValueChange={(val) => onSelect(val as Task["status"])}
				>
					{(Object.keys(statusLabels) as Task["status"][]).map((st) => (
						<DropdownMenuRadioItem
							key={st}
							value={st}
							className={`gap-2 px-3 py-2 text-sm cursor-pointer`}
						>
							<div className={`rounded-md px-2 py-0.5 text-xs font-semibold ${statusColors[st]}`}>
								{statusLabels[st]}
							</div>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
