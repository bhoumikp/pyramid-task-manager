"use client";

import { useEffect, useState } from "react";
import {
	ArrowRight,
	Calendar,
	ChevronDown,
	Dot,
	Ellipsis,
	Eye,
	Lock,
	MoreHorizontal,
	PanelLeft,
	Paperclip,
	Plus,
	SendHorizontal,
	Settings,
	Share2,
	Signal,
	Tag,
	Users,
} from "lucide-react";

import { getTask } from "@/lib/api";
import {
	formatTaskDate,
	taskPriorityLabels,
	type Task,
} from "@/lib/tasks";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";

const labels = ["Research", "Design", "Development", "Testing", "Deployment"];

const subtasks = [
	{
		id: "sub-1",
		title: "Subtask 1",
		priority: "HIGH",
		member: {
			name: "Dexter",
			avatarUrl: "https://ui.shadcn.com/avatars/shadcn.jpg",
		},
		dueDate: "2026-09-12",
	},
	{
		id: "sub-2",
		title: "Subtask 2",
		priority: "LOW",
		member: {
			name: "CN",
			avatarUrl: "",
		},
		dueDate: "2026-09-15",
	},
	{
		id: "sub-3",
		title: "Subtask 3",
		priority: "MEDIUM",
		member: null,
		dueDate: "2026-09-18",
	},
] as const;

const updates = [
	{
		id: "u-1",
		name: "You",
		avatarUrl: "https://ui.shadcn.com/avatars/shadcn.jpg",
		message: "changed priority from No priority to Urgent",
		time: "Aug 2026",
	},
	{
		id: "u-2",
		name: "You",
		avatarUrl: "https://ui.shadcn.com/avatars/shadcn.jpg",
		message: "posted an update",
		time: "Aug 2026",
	},
];

const statusLabels: Record<Task["status"], string> = {
	TODO: "Backlog",
	DOING: "In Progress",
	COMPLETED: "Done",
	ON_HOLD: "On Hold",
};

const priorityColorClass: Record<Task["priority"], string> = {
	NONE: "text-muted-foreground",
	URGENT: "text-destructive",
	HIGH: "text-orange-500",
	MEDIUM: "text-amber-500",
	LOW: "text-sky-500",
};

function PriorityIcon({ priority }: { priority: Task["priority"] }) {
	return <Signal className={`size-3.5 ${priorityColorClass[priority]}`} />;
}

export function TaskDetails({ taskId }: { taskId: string }) {
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const { setItems } = useBreadcrumbs();

	useEffect(() => {
		async function loadTask() {
			try {
				const result = await getTask(taskId);
				setTask(result);
			} catch (error) {
				console.error("Failed to load task:", error);
			} finally {
				setLoading(false);
			}
		}

		void loadTask();
	}, [taskId]);

	useEffect(() => {
		if (!task) {
			return;
		}

		setItems([
			{
				label: "Tasks",
				href: "/tasks",
			},
			{
				label: task.title,
				href: `/tasks/${taskId}`,
			},
		]);

		return () => {
			setItems([]);
		};
	}, [setItems, task, taskId]);

	if (loading) {
		return <div className="p-4 text-sm text-muted-foreground">Loading task...</div>;
	}

	if (!task) {
		return <div className="p-4 text-sm text-muted-foreground">Task not found.</div>;
	}

	const startDate = formatTaskDate(task.startDate, "short");
	const dueDate = formatTaskDate(task.dueDate, "short");

	return (
		<div className="flex h-full min-h-0 flex-col gap-4 p-2">
			<header className="flex items-start justify-between gap-4">
				<div className="min-w-0 space-y-2">
					<div className="space-y-1.5">
						<h1 className="text-2xl font-semibold">{task.title}</h1>
						<p className="max-w-3xl text-sm text-muted-foreground">
							{task.description || "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively."}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon-lg" className="rounded ">
						<Lock size={14} />
					</Button>
					<Button variant="outline" size="lg" className="rounded px-3 text-xs text-primary">
						<Eye size={14} />
						1
					</Button>
					<Button variant="outline" size="icon-lg" className="rounded ">
						<Share2 size={14} />
					</Button>
					<Button variant="outline" size="icon-lg" className="rounded ">
						<MoreHorizontal size={14} />
					</Button>
					<Button variant="outline" size="icon-lg" className="rounded ">
						<PanelLeft size={14} />
					</Button>
				</div>
			</header>

			<div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
				<main className="min-w-0 space-y-5">
					<section className="space-y-4">
						<div className="flex items-center gap-4">
							<h2 className="min-w-[78px] text-sm font-medium text-muted-foreground">Properties</h2>
							<div className="flex min-w-0 flex-wrap items-center gap-2">
								{task.assignee ? (
									<div className="flex items-center gap-2">
										<Avatar className="h-7 w-7 rounded-full">
											<AvatarImage src={task.assignee.avatarUrl ?? undefined} alt={task.assignee.name} />
											<AvatarFallback>
												{task.assignee.name.slice(0, 1).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-medium">
											{task.assignee.name}
										</span>
									</div>
								) : (
									<Badge variant="secondary">Unassigned</Badge>
								)}

								{dueDate && (
									<Badge variant="destructive" className="bg-destructive/10 text-destructive">
										<Calendar className="size-3.5" />
										{dueDate}
									</Badge>
								)}
							</div>
						</div>

						<div className="flex items-start gap-4">
							<h2 className="min-w-[78px] pt-0.5 text-sm font-medium text-muted-foreground">Labels</h2>
							<div className="flex flex-wrap items-center gap-2">
								{labels.map((label) => (
									<Badge key={label} variant="secondary" className="gap-1 text-xs font-medium">
										<Tag className="size-3" />
										{label}
									</Badge>
								))}
								<Button variant={"secondary"} size={"icon-xs"} className={""}>
									<Plus size={14} />
								</Button>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<h2 className="min-w-[78px] pt-0.5 text-sm font-medium text-muted-foreground">Resources</h2>
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Paperclip className="size-3.5" />
								<span>Add document or link...</span>
							</div>
						</div>
					</section>

					<section>
						<Collapsible className="group/collapsible space-y-4" defaultOpen>
							<CollapsibleTrigger className="w-full cursor-pointer">
								<div className="flex items-center gap-2 text-sm font-medium">
									<ChevronDown fill="currentColor" stroke="0" className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" />
									Subtasks
								</div>
							</CollapsibleTrigger>

							<CollapsibleContent className="">
								<div className="overflow-hidden rounded-lg border">
									<Table className="text-sm bg-background">
										<TableHeader >
											<TableRow className="bg-background">
												<TableHead className="px-3">Task</TableHead>
												<TableHead>Priority</TableHead>
												<TableHead>Members</TableHead>
												<TableHead>Due Date</TableHead>
												<TableHead className="text-right px-3">Actions</TableHead>
											</TableRow>
										</TableHeader>

										<TableBody>
											{subtasks.map((subtask) => (
												<TableRow key={subtask.id}>
													<TableCell className="px-3 font-medium">{subtask.title}</TableCell>
													<TableCell>
														<span className={`flex items-center gap-1 text-xs font-medium ${priorityColorClass[subtask.priority]}`}>
															<PriorityIcon priority={subtask.priority} />
															{taskPriorityLabels[subtask.priority]}
														</span>
													</TableCell>
													<TableCell>
														{subtask.member ? (
															<div className="flex items-center gap-2">
																{subtask.member.avatarUrl ? (
																	<Avatar className="h-7 w-7 rounded-full">
																		<AvatarImage src={subtask.member.avatarUrl} alt={subtask.member.name} />
																		<AvatarFallback>{subtask.member.name.slice(0, 1)}</AvatarFallback>
																	</Avatar>
																) : (
																	<Avatar className="h-7 w-7 rounded-full">
																		<AvatarFallback>CN</AvatarFallback>
																	</Avatar>
																)}
																<span className="text-sm text-muted-foreground">{subtask.member.name}</span>
															</div>
														) : (
															<div className="flex items-center gap-2 text-muted-foreground">
																<div className="flex size-7 items-center justify-center rounded-full bg-muted">+</div>
																<span className="text-sm">Add</span>
															</div>
														)}
													</TableCell>
													<TableCell>{formatTaskDate(subtask.dueDate, "short")}</TableCell>
													<TableCell className="text-right">
														<Button variant="ghost" size="icon-sm" className="border-0">
															<Ellipsis size={14} />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>

										<TableFooter className="bg-background">
											<TableRow className="border-0">
												<TableCell colSpan={5} className="px-3 py-2">
													<Button variant="ghost" size="xs" className="rounded-3xl border-0">
														<Plus />
														Add Subtasks
													</Button>
												</TableCell>
											</TableRow>
										</TableFooter>
									</Table>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</section>

					<section className="space-y-5">
						<h3 className="text-sm font-medium">Comments</h3>

						<ul className="space-y-5">
							<li className="border rounded-md">
								<div className="space-y-2 p-4">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Avatar className="h-7 w-7 rounded-full">
												<AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="Ankit Dutta" />
												<AvatarFallback>AD</AvatarFallback>
											</Avatar>
											<span className="text-xs font-medium">Ankit Dutta</span>
											<span className="text-xs text-muted-foreground">just now</span>
										</div>
										<div>
											<Ellipsis size={14} />
										</div>
									</div>
									<span>dsds</span>
								</div>
								<div className="flex gap-2.5 px-4 py-3 border-t">
									<Avatar className="h-7 w-7 rounded-full">
										<AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="Ankit Dutta" />
										<AvatarFallback>AD</AvatarFallback>
									</Avatar>
									<InputGroup className="border-0 gap-4">
										<InputGroupInput
											className="text-accent-foreground" 
											placeholder="Leave a reply..." 
										/>
										<InputGroupAddon align={"inline-end"}>
											<Paperclip className="text-primary" size={16}/>
										</InputGroupAddon>
										<InputGroupAddon className="text-primary" align="inline-end">
											<SendHorizontal size={16}/>
										</InputGroupAddon>
									</InputGroup>
								</div>
							</li>

							<li className="border rounded-md">
								<div className="space-y-2 p-4">
									<div className="flex justify-between">
										<div className="flex items-center gap-2">
											<Avatar className="h-7 w-7 rounded-full">
												<AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="Ankit Dutta" />
												<AvatarFallback>AD</AvatarFallback>
											</Avatar>
											<span className="text-xs font-medium">Ankit Dutta</span>
											<span className="text-xs text-muted-foreground">just now</span>
										</div>
										<div>
											<Ellipsis size={14} />
										</div>
									</div>
									<span>dsds</span>
								</div>
								<div className="flex gap-2.5 px-4 py-3 border-t">
									<Avatar className="h-7 w-7 rounded-full">
										<AvatarImage src="https://ui.shadcn.com/avatars/shadcn.jpg" alt="Ankit Dutta" />
										<AvatarFallback>AD</AvatarFallback>
									</Avatar>
									<InputGroup className="border-0 gap-4">
										<InputGroupInput
											className="text-accent-foreground" 
											placeholder="Leave a reply..." 
										/>
										<InputGroupAddon align={"inline-end"}>
											<Paperclip className="text-primary" size={16}/>
										</InputGroupAddon>
										<InputGroupAddon className="text-primary" align="inline-end">
											<SendHorizontal size={16}/>
										</InputGroupAddon>
									</InputGroup>
								</div>
							</li>
						</ul>

						<div className="px-4 py-3 border rounded-md">
							<InputGroup className="border-0 gap-4 rounded">
								<InputGroupInput
									className="text-accent-foreground " 
									placeholder="Add a comment..." 
								/>
								<InputGroupAddon align={"inline-end"}>
									<Paperclip className="text-primary" size={16}/>
								</InputGroupAddon>
								<InputGroupAddon className="text-primary cursor-pointer" align="inline-end">
									<SendHorizontal size={16}/>
								</InputGroupAddon>
							</InputGroup>
						</div>
					</section>
				</main>

				<aside className="min-w-0 space-y-5">
					<Collapsible className="group/collapsible border rounded-lg p-3 space-y-3" defaultOpen>
						<div className="flex items-center justify-between gap-3">
							<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
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
								<li className="grid grid-cols-[88px_1fr] items-center gap-3">
									<span className="text-xs text-muted-foreground font-medium">Status</span>
									<span className="flex items-center gap-2 text-xs text-orange-500">
										<span className="size-2 rounded-full bg-orange-500" />
										{statusLabels[task.status]}
									</span>
								</li>

								<li className="grid grid-cols-[88px_1fr] items-start gap-3">
									<span className="text-xs text-muted-foreground font-medium">Priority</span>
									<DropdownMenu>
										<DropdownMenuTrigger render={
											<Button variant="ghost" size="sm" className="h-6 justify-start gap-2 border-0 px-0 text-xs text-destructive">
												<PriorityIcon priority={task.priority} />
												{taskPriorityLabels[task.priority]}
												<ChevronDown className="size-3.5" />
											</Button>
										} />
										<DropdownMenuContent className="min-w-44 rounded-lg p-1">
											<div className="px-2 py-2 text-xs text-muted-foreground font-medium">Priority</div>
											<DropdownMenuRadioGroup value={task.priority} onValueChange={() => undefined}>
												<DropdownMenuRadioItem value="NONE" className="gap-2 px-3 py-2 text-sm">
													<span className="size-2 rounded-full bg-muted-foreground/40" />
													No Priority
												</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="URGENT" className="gap-2 px-3 py-2 text-sm text-destructive">
													<Signal className="size-3.5" />
													Urgent
												</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="HIGH" className="gap-2 px-3 py-2 text-sm text-orange-500">
													<Signal className="size-3.5" />
													High
												</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="MEDIUM" className="gap-2 px-3 py-2 text-sm text-amber-500">
													<Signal className="size-3.5" />
													Medium
												</DropdownMenuRadioItem>
												<DropdownMenuRadioItem value="LOW" className="gap-2 px-3 py-2 text-sm text-sky-500">
													<Signal className="size-3.5" />
													Low
												</DropdownMenuRadioItem>
											</DropdownMenuRadioGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</li>

								<li className="grid grid-cols-[88px_1fr] items-center gap-3">
									<span className="text-xs text-muted-foreground font-medium">Members</span>
									<Button variant="ghost" size="xs" className="justify-start border-0 px-0 text-xs">
										<Users />
										Add Members
									</Button>
								</li>

								<li className="grid grid-cols-[88px_1fr] items-center gap-3">
									<span className="text-xs text-muted-foreground font-medium">Dates</span>
									<span className="flex items-center gap-2 text-xs text-muted-foreground">
										<Badge variant="outline" className="text-x text-muted-foreground">
											<Calendar className="size-3" />
											{startDate || "Start"}
										</Badge>
										<ArrowRight size={14} />
										<Badge variant="outline" className="text-xs text-muted-foreground">
											<Calendar className="size-3" />
											{dueDate || "End"}
										</Badge>
									</span>
								</li>

								<li className="grid grid-cols-[88px_1fr] items-center gap-3">
									<span className="text-xs text-muted-foreground font-medium">Reporter</span>
									<div className="flex items-center gap-2">
										<Avatar className="h-4 w-4 rounded-full">
											<AvatarImage src={task.createdBy.avatarUrl ?? undefined} alt={task.createdBy.name} />
											<AvatarFallback className="text-[10px]">
												{task.createdBy.name.slice(0, 1).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="text-xs">{task.createdBy.name}</span>
									</div>
								</li>
							</ul>
						</CollapsibleContent>
					</Collapsible>

					<Collapsible className="group/collapsible border p-3 space-y-3 rounded-lg" defaultOpen>
						<CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
							<ChevronDown 
								className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" 
								fill="currentColor"
								stroke="0"
							/>
							Updates
						</CollapsibleTrigger>
						<CollapsibleContent className="pt-3">
							<div className="space-y-3">
								{updates.map((update) => (
									<div key={update.id} className="flex gap-3">
										<Avatar className="h-7 w-7 rounded-full">
											<AvatarImage src={update.avatarUrl} alt={update.name} />
											<AvatarFallback>{update.name.slice(0, 1)}</AvatarFallback>
										</Avatar>
										<div className="min-w-0 text-sm">
											<p className="font-medium">{update.name}</p>
											<div className="flex truncate max-w-[90%] gap-1 items-center">
												<p className="text-muted-foreground">
													{update.message}
												</p>
												<Dot />
												{update.time ? (
													<p className="text-muted-foreground">{update.time}</p>
												) : null}
											</div>
										</div>
									</div>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				</aside>
			</div>
		</div>
	);
}
