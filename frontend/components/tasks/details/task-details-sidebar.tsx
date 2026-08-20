import {
	ArrowRight,
	Calendar as CalendarIcon,
	ChevronDown,
	Plus,
	Settings,
	Users,
} from "lucide-react";

import {
	formatRelativeTime,
	formatTaskDate,
	type Task,
	type TaskActivityItem,
	type UserSummary,
} from "@/lib/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { statusColors, statusLabels } from "./task-details-constants";
import { MemberSelect } from "../member-select";
import { PrioritySelect } from "../priority-select";
import { StatusSelect } from "../status-select";

import { useContext } from "react";
import { TasksContext } from "@/contexts/tasks-context";

interface TaskDetailsSidebarProps {
	task: Task;
	members: UserSummary[];
	activities: TaskActivityItem[];
	startDateInput: string;
	dueDateInput: string;
	currentUser?: UserSummary | null;
	onStartDateInputChange: (value: string) => void;
	onDueDateInputChange: (value: string) => void;
	onUpdateTask: (updates: Partial<Task> & { assigneeId?: string | null }) => void;
}

export function TaskDetailsSidebar({
	task,
	members,
	activities,
	currentUser: propCurrentUser,
	onStartDateInputChange,
	onDueDateInputChange,
	onUpdateTask,
}: TaskDetailsSidebarProps) {
	const tasksCtx = useContext(TasksContext);
	const currentUser = propCurrentUser ?? tasksCtx?.currentUser;
	const isReporterCurrentUser = currentUser && task.createdBy.id === currentUser.id;
	const startDateFormatted = formatTaskDate(task.startDate, "short");
	const dueDateFormatted = formatTaskDate(task.dueDate, "short");

	return (
		<aside className="sticky top-4 self-start overflow-y-auto min-w-0 space-y-5">
			{/* Details Panel */}
			<Collapsible className="group/collapsible border rounded-lg p-3 space-y-3" defaultOpen>
				<div className="flex items-center justify-between gap-3">
					<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium cursor-pointer">
						<ChevronDown
							className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90"
							fill="currentColor"
							stroke="0"
						/>
						Details
					</CollapsibleTrigger>

					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon-sm" className="border-0">
							<Plus size={14} />
						</Button>
						<Button variant="ghost" size="icon-sm" className="border-0">
							<Settings size={14} />
						</Button>
					</div>
				</div>

				<CollapsibleContent>
					<ul className="space-y-3 text-sm">
						{/* Status Select */}
						<li className="grid grid-cols-[88px_1fr] items-center gap-3">
							<span className="text-xs text-muted-foreground font-medium">Status</span>
							<StatusSelect
								status={task.status}
								onSelect={(status) => onUpdateTask({ status })}
								nativeButton={false}
								trigger={
									<div className="w-fit">
										<Button
											variant="ghost"
											size="sm"
											className={`h-6 justify-start gap-2 border-0 px-2 text-xs font-medium rounded-full cursor-pointer ${statusColors[task.status]}`}
										>
											<span className="size-2 rounded-full bg-current" />
											{statusLabels[task.status]}
											<ChevronDown className="size-3.5" />
										</Button>
									</div>
								}
							/>
						</li>

						{/* Priority Select */}
						<li className="grid grid-cols-[88px_1fr] items-center gap-3">
							<span className="text-xs text-muted-foreground font-medium">Priority</span>
							<PrioritySelect
								priority={task.priority}
								onSelect={(priority) => onUpdateTask({ priority })}
							/>
						</li>

						{/* Members */}
						<li className="grid grid-cols-[88px_1fr] items-center gap-3">
							<span className="text-xs text-muted-foreground font-medium">Members</span>
							<MemberSelect
								members={members}
								selectedMemberId={task.assignee?.id}
								onSelect={(assigneeId) => onUpdateTask({ assigneeId })}
								nativeButton={false}
								trigger={
									<div className="w-fit">
										<Button variant="ghost" size="xs" className="justify-start border-0 p-2 text-xs gap-1.5 cursor-pointer">
											<Users className="size-3.5" />
											{task.assignee ? task.assignee.name : "Add Members"}
										</Button>
									</div>
								}
							/>
						</li>

						{/* Dates (Start & Due) */}
						<li className="grid grid-cols-[88px_1fr] items-center gap-3">
							<span className="text-xs text-muted-foreground font-medium">Dates</span>
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								{/* Start Date Picker */}
								<Popover>
									<PopoverTrigger
										nativeButton={false}
										render={
											<Badge variant="outline" className="text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer">
												<CalendarIcon className="size-3" />
												{startDateFormatted || "Start"}
											</Badge>
										}
									/>
									<PopoverContent align="start" className="w-auto p-0">
										<Calendar
											mode="single"
											selected={task.startDate ? new Date(task.startDate) : undefined}
											onSelect={(date) => {
												const val = date ? date.toISOString() : null;
												onStartDateInputChange(val ? val.split("T")[0] : "");
												onUpdateTask({ startDate: val });
											}}
											disabled={(date) => (task.dueDate ? date > new Date(task.dueDate) : false)}
											className="p-3"
										/>
									</PopoverContent>
								</Popover>

								<ArrowRight size={14} />

								{/* Due Date Picker */}
								<Popover>
									<PopoverTrigger
										nativeButton={false}
										render={
											<Badge variant="outline" className="text-xs text-muted-foreground hover:text-foreground gap-1 cursor-pointer">
												<CalendarIcon className="size-3" />
												{dueDateFormatted || "End"}
											</Badge>
										}
									/>
									<PopoverContent align="start" className="w-auto p-0">
										<Calendar
											mode="single"
											selected={task.dueDate ? new Date(task.dueDate) : undefined}
											onSelect={(date) => {
												const val = date ? date.toISOString() : null;
												onDueDateInputChange(val ? val.split("T")[0] : "");
												onUpdateTask({ dueDate: val });
											}}
											disabled={(date) => (task.startDate ? date < new Date(task.startDate) : false)}
											className="p-3"
										/>
									</PopoverContent>
								</Popover>
							</div>
						</li>

						{/* Reporter */}
						<li className="grid grid-cols-[88px_1fr] items-center gap-3">
							<span className="text-xs text-muted-foreground font-medium">Reporter</span>
							<div className="flex items-center gap-1">
								<Avatar className="size-6 rounded-full">
									<AvatarImage src={task.createdBy.avatarUrl ?? undefined} alt={task.createdBy.name} />
									<AvatarFallback className="text-xs">
										{task.createdBy.name.slice(0, 1).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span className="text-xs font-medium">
									{isReporterCurrentUser ? "You" : task.createdBy.name}
								</span>
							</div>
						</li>
					</ul>
				</CollapsibleContent>
			</Collapsible>

			{/* Updates / Activity Feed */}
			<Collapsible className="group/collapsible border p-3 space-y-3 rounded-lg" defaultOpen>
				<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium cursor-pointer">
					<ChevronDown
						className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90"
						fill="currentColor"
						stroke="0"
					/>
					Updates ({activities.length})
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="space-y-3 max-h-[calc(100vh-30rem)] overflow-y-auto">
						{activities.length > 0 ? (
							activities.map((act) => (
								<div key={act.id} className="flex items-center gap-2">
									<Avatar className="size-6 rounded-full shrink-0">
										<AvatarImage src={act.actor.avatarUrl ?? undefined} alt={act.actor.name} />
										<AvatarFallback>{act.actor.name.slice(0, 1)}</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1 text-sm">
										<p className="font-medium">{act.actor.name}</p>
										<p className="text-muted-foreground truncate" title={act.message}>
											{`${act.message} • ${formatRelativeTime(act.createdAt)}`}
										</p>
									</div>
								</div>
							))
						) : (
							<p className="text-xs text-muted-foreground">No updates recorded yet.</p>
						)}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</aside>
	);
}

