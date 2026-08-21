"use client";

import { Button } from "../ui/button";
import {
	Calendar,
	Circle,
	Dot,
	Funnel,
	RotateCcw,
	Signal,
	SignalHigh,
	SignalLow,
	SignalMedium,
	Tag,
	User,
	Users,
} from "lucide-react";
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
} from "@/components/ui/dropdown-menu";
import { useTasks } from "@/hooks/use-tasks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

export function AppFilterDropdown() {
	const {
		tasks,
		members,
		currentUser,
		statusFilters,
		priorityFilters,
		memberFilters,
		reporterFilters,
		labelFilters,
		dueDateFilters,
		toggleStatusFilter,
		togglePriorityFilter,
		toggleMemberFilter,
		toggleReporterFilter,
		toggleLabelFilter,
		toggleDueDateFilter,
		clearAllFilters,
	} = useTasks();

	const totalActiveFilters =
		statusFilters.length +
		priorityFilters.length +
		memberFilters.length +
		reporterFilters.length +
		labelFilters.length +
		dueDateFilters.length;

	// Extract unique labels from all tasks
	const availableLabels = Array.from(
		new Set([
			...tasks.flatMap((t) => t.labels || []),
		])
	);

	const statusOptions = [
		{ label: "To Do", value: "TODO" as const, color: "text-muted-foreground bg-muted-foreground/10" },
		{ label: "Doing", value: "DOING" as const, color: "text-orange-500 bg-orange-500/10" },
		{ label: "Completed", value: "COMPLETED" as const, color: "text-emerald-500 bg-emerald-500/10" },
		{ label: "On Hold", value: "ON_HOLD" as const, color: "text-amber-500 bg-amber-500/10" },
	];

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
					{/* Status Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<Circle className="size-4" />
							<span>Status</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-48" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Status
									</DropdownMenuLabel>
									{statusOptions.map((opt) => (
										<DropdownMenuCheckboxItem
											key={opt.value}
											className="py-2 pr-8 pl-3 cursor-pointer"
											checked={statusFilters.includes(opt.value)}
											onCheckedChange={() => toggleStatusFilter(opt.value)}
										>
											<span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", opt.color)}>
												{opt.label}
											</span>
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

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

					{/* Members Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<Users className="size-4" />
							<span>Members</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-52 max-h-64 overflow-y-auto" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Assignee
									</DropdownMenuLabel>
									<DropdownMenuCheckboxItem
										className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
										checked={memberFilters.includes("unassigned")}
										onCheckedChange={() => toggleMemberFilter("unassigned")}
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
											checked={memberFilters.includes(m.id)}
											onCheckedChange={() => toggleMemberFilter(m.id)}
										>
											<Avatar className="size-5 rounded-full">
												<AvatarImage src={m.avatarUrl ?? undefined} alt={m.name} />
												<AvatarFallback className="text-[10px]">
													{m.name.slice(0, 1).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											{m.name}
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

					{/* Labels Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<Tag className="size-4" />
							<span>Labels</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-48 max-h-64 overflow-y-auto" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Labels
									</DropdownMenuLabel>
									{availableLabels.map((lbl) => (
										<DropdownMenuCheckboxItem
											key={lbl}
											className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
											checked={labelFilters.includes(lbl)}
											onCheckedChange={() => toggleLabelFilter(lbl)}
										>
											<Tag className="size-4" />
											{lbl}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>

					{/* Reporter Submenu */}
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="py-2 px-3 gap-2.5 cursor-pointer">
							<User className="size-4" />
							<span>Reporter</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="min-w-52 max-h-64 overflow-y-auto" sideOffset={10}>
								<DropdownMenuGroup>
									<DropdownMenuLabel className="py-2 px-3 text-xs font-semibold text-muted-foreground">
										Reporter
									</DropdownMenuLabel>
									{members.map((m) => (
										<DropdownMenuCheckboxItem
											key={m.id}
											className="py-2 pr-8 pl-3 gap-2.5 cursor-pointer"
											checked={reporterFilters.includes(m.id)}
											onCheckedChange={() => toggleReporterFilter(m.id)}
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

					{totalActiveFilters > 0 && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="py-2 px-3 gap-2 cursor-pointer text-destructive focus:text-destructive text-xs"
								onClick={clearAllFilters}
							>
								<RotateCcw className="size-3.5" />
								<span>Reset All Filters</span>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
