"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Calendar as CalendarIcon, ChevronDown, GalleryVerticalEnd, Plus, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ConfirmDeleteDialog } from "../app/confirm-delete-dialog";
import { MemberSelect } from "../tasks/member-select";
import { PrioritySelect } from "../tasks/priority-select";
import { useProjects } from "@/hooks/use-projects";
import type { Project, ProjectFieldState } from "@/lib/projects";
import { ProjectAddDialog } from "./project-add-dialog";
import { Skeleton } from "../ui/skeleton";

function formatProjectDate(dateStr?: string | null) {
	if (!dateStr) return null;
	try {
		return format(parseISO(dateStr), "dd MMM yyyy");
	} catch {
		return dateStr;
	}
}

function matchesDueDateFilter(dueDateStr: string | null | undefined, filterKeys: string[]): boolean {
	if (filterKeys.length === 0) return true;
	if (!dueDateStr) return filterKeys.includes("no_due_date");

	const due = new Date(dueDateStr);
	const now = new Date();
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
	const endOfWeek = new Date(startOfToday);
	endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
	endOfWeek.setHours(23, 59, 59, 999);

	return filterKeys.some((key) => {
		if (key === "no_due_date") return !dueDateStr;
		if (key === "overdue") return due < startOfToday;
		if (key === "today") return due >= startOfToday && due <= endOfToday;
		if (key === "this_week") return due >= startOfToday && due <= endOfWeek;
		return false;
	});
}

export function ProjectTable() {
	const {
		projects,
		members,
		search,
		priorityFilters,
		leadFilters,
		dueDateFilters,
		visibleFields,
		loading,
		updateProject,
		deleteProject,
	} = useProjects();

	const [editingDateId, setEditingDateId] = useState<string | null>(null);

	const filteredProjects = projects.filter((project) => {
		const query = search.trim().toLowerCase();
		const matchesSearch =
			query.length === 0 ||
			project.title.toLowerCase().includes(query) ||
			(project.description ?? "").toLowerCase().includes(query) ||
			(project.lead?.name ?? "").toLowerCase().includes(query);

		const matchesPriority =
			priorityFilters.length === 0 || priorityFilters.includes(project.priority);

		const matchesLead =
			leadFilters.length === 0 ||
			(leadFilters.includes("unassigned") && !project.lead) ||
			(project.lead && leadFilters.includes(project.lead.id));

		const matchesDueDate = matchesDueDateFilter(project.dueDate, dueDateFilters);

		return matchesSearch && matchesPriority && matchesLead && matchesDueDate;
	});

	const footerColSpan =
		2 +
		Number(visibleFields.priority) +
		Number(visibleFields.lead) +
		Number(visibleFields.dueDate);

	if (loading) {
		return (
			<div className="flex h-full min-h-0 flex-col p-4 gap-4">
				<Skeleton className="h-8 w-48 rounded-md" />
				<Skeleton className="h-64 w-full rounded-md" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-lg border">
				<Table className="font-medium bg-background text-sm">
					<TableHeader>
						<TableRow className="bg-background">
							<TableHead className="w-[35%] min-w-[200px] px-3">Projects</TableHead>
							{visibleFields.priority && <TableHead>Priority</TableHead>}
							{visibleFields.lead && <TableHead>Lead</TableHead>}
							{visibleFields.dueDate && <TableHead>Due Date</TableHead>}
							<TableHead className="text-right px-3">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{filteredProjects.length >= 0 &&
							filteredProjects.map((project: Project) => (
								<TableRow key={project.id}>
									<TableCell className="px-3">
										<Link
											href={`/projects/${project.id}`}
											className="font-medium text-foreground hover:underline hover:text-primary transition-colors cursor-pointer"
										>
											{project.title}
										</Link>
									</TableCell>

									{/* Priority */}
									{visibleFields.priority && (
										<TableCell>
											<PrioritySelect
												priority={project.priority}
												onSelect={(p) => updateProject(project.id, { priority: p })}
											/>
										</TableCell>
									)}

									{/* Lead */}
									{visibleFields.lead && (
										<TableCell>
											<MemberSelect
												members={members}
												selectedMemberId={project.lead?.id}
												onSelect={(leadId) => updateProject(project.id, { leadId })}
												trigger={
													<button
														type="button"
														className="flex items-center gap-2 text-xs cursor-pointer border-0 bg-transparent p-0"
													>
														{project.lead ? (
															<Avatar className="size-7 rounded-full">
																<AvatarImage src={project.lead.avatarUrl ?? undefined} />
																<AvatarFallback className="text-[10px]">
																	{project.lead.name.slice(0, 1).toUpperCase()}
																</AvatarFallback>
															</Avatar>
														) : (
															<span className="size-7 inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
																<Plus size={14} />
															</span>
														)}
													</button>
												}
											/>
										</TableCell>
									)}

									{/* Due Date */}
									{visibleFields.dueDate && (
										<TableCell>
											<Popover
												open={editingDateId === project.id}
												onOpenChange={(open) => setEditingDateId(open ? project.id : null)}
											>
												<PopoverTrigger
													render={
														<button
															type="button"
															className="cursor-pointer text-sm hover:underline border-0 bg-transparent p-0 text-left font-normal"
														>
															{project.dueDate ? (
																<span className="font-medium">
																	{formatProjectDate(project.dueDate)}
																</span>
															) : (
																<span className="text-muted-foreground">No date</span>
															)}
														</button>
													}
												/>
												<PopoverContent className="w-auto" align="start">
													<Calendar
														className="p-3"
														mode="single"
														selected={project.dueDate ? parseISO(project.dueDate) : undefined}
														onSelect={(date) => {
															updateProject(project.id, {
																dueDate: date ? date.toISOString().split("T")[0] : null,
															});
															setEditingDateId(null);
														}}
													/>
												</PopoverContent>
											</Popover>
										</TableCell>
									)}

									{/* Actions */}
									<TableCell className="text-right px-3">
										<ConfirmDeleteDialog
											title="Delete project?"
											description={`Are you sure you want to delete "${project.title}"? This action cannot be undone.`}
											onConfirm={() => deleteProject(project.id)}
											trigger={
												<Button
													variant="ghost"
													size="icon-sm"
													className="border-0 text-muted-foreground hover:text-destructive cursor-pointer"
												>
													<Trash2 size={14} />
												</Button>
											}
										/>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>

					<TableFooter className="bg-background">
						<TableRow className="border-0">
							<TableCell colSpan={footerColSpan} className="p-2">
								<ProjectAddDialog trigger={
									<Button variant={"ghost"} className="text-xs border-0 ">
										<Plus size={14} />
										Add Project
									</Button>
								} />
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</div>
	);
}
