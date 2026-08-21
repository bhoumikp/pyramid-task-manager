"use client";

import {
	Calendar,
	Dot,
	Funnel,
	RotateCcw,
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	User,
} from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";

export function ProjectFilterDropdown() {
	const {
		members,
		currentUser,
		priorityFilters,
		leadFilters,
		dueDateFilters,
		togglePriorityFilter,
		toggleLeadFilter,
		toggleDueDateFilter,
		clearAllFilters,
	} = useProjects();

	const totalActiveFilters =
		priorityFilters.length +
		leadFilters.length +
		dueDateFilters.length;

	const priorityOptions = [
		{ label: "No Priority", value: "NONE" as const, icon: Dot },
		{ label: "Urgent", value: "URGENT" as const, icon: Signal, color: "text-red-500" },
		{ label: "High", value: "HIGH" as const, icon: SignalHigh, color: "text-orange-500" },
		{ label: "Medium", value: "MEDIUM" as const, icon: SignalMedium, color: "text-yellow-500" },
		{ label: "Low", value: "LOW" as const, icon: SignalLow, color: "text-muted-foreground" },
	];

	const dueDateOptions = [
		{ label: "Overdue", value: "overdue" },
		{ label: "Due Today", value: "today" },
		{ label: "Due This Week", value: "this_week" },
		{ label: "No Due Date", value: "no_due_date" },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="outline"
						className={cn(
							"relative px-2 rounded text-xs gap-1.5 cursor-pointer",
							totalActiveFilters > 0 && "bg-primary/10 text-primary border-primary/30 font-medium"
						)}
					>
						<Funnel className="size-3.5" />
						{totalActiveFilters > 0 && (
							<Badge variant="default" className="h-4 px-1 text-[10px] min-w-4 rounded-full justify-center">
								{totalActiveFilters}
							</Badge>
						)}
					</Button>
				}
			/>

			<DropdownMenuContent
				className="w-56 rounded-md shadow-lg"
				align="end"
			>
				<DropdownMenuGroup className="flex flex-col gap-0.5">
					{/* Priority Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<Signal className="size-4" />
							<span>Priority</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-48" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Priority
									</DropdownMenuLabel>
									{priorityOptions.map((opt) => (
										<DropdownMenuCheckboxItem
											key={opt.value}
											className={`py-2 pr-8 pl-3 gap-2.5 cursor-pointer ${opt.color ?? ""}`}
											checked={priorityFilters.includes(opt.value)}
											onCheckedChange={() => togglePriorityFilter(opt.value)}
										>
											<opt.icon className="size-4" />
											{opt.label}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					{/* Lead Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<User className="size-4" />
							<span>Lead</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-52 max-h-64 overflow-y-auto" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Project Lead
									</DropdownMenuLabel>
									<DropdownMenuCheckboxItem
										className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
										checked={leadFilters.includes("unassigned")}
										onCheckedChange={() => toggleLeadFilter("unassigned")}
									>
										<Avatar className="flex items-center justify-center size-5 rounded-full">
											<User className="size-3" />
										</Avatar>
										Unassigned
									</DropdownMenuCheckboxItem>
									{members.map((m) => (
										<DropdownMenuCheckboxItem
											key={m.id}
											className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
											checked={leadFilters.includes(m.id)}
											onCheckedChange={() => toggleLeadFilter(m.id)}
										>
											<Avatar className="size-5 rounded-full">
												<AvatarImage src={m.avatarUrl ?? undefined} alt={m.name} />
												<AvatarFallback className="text-[10px]">
													{m.name.slice(0, 1).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											{m.id === currentUser?.id ? "You" : m.name}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					{/* Due Date Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<Calendar className="size-4" />
							<span>Due Date</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-48" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Due Date
									</DropdownMenuLabel>
									{dueDateOptions.map((opt) => (
										<DropdownMenuCheckboxItem
											key={opt.value}
											className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
											checked={dueDateFilters.includes(opt.value)}
											onCheckedChange={() => toggleDueDateFilter(opt.value)}
										>
											<Calendar className="size-4" />
											{opt.label}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					{totalActiveFilters > 0 && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="py-2 px-3 gap-2 cursor-pointer text-destructive focus:text-destructive text-xs"
								onClick={clearAllFilters}
							>
								<RotateCcw className="size-3.5" />
								Clear all filters
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
