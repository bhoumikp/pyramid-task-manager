import { useState } from "react";
import {
	ChevronDown,
	CornerDownLeft,
	Plus,
	Trash2,
	X,
} from "lucide-react";

import {
	type Subtask,
	type Task,
	type UserSummary,
} from "@/lib/tasks";
import { cn, NO_FOCUS_BORDER_CLASS } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { ConfirmDeleteDialog } from "@/components/app/confirm-delete-dialog";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../ui/collapsible";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../../ui/table";
import { statusColors, statusLabels } from "./task-details-constants";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MemberSelect } from "../member-select";
import { PrioritySelect } from "../priority-select";
import { StatusSelect } from "../status-select";

interface TaskDetailsSubtasksProps {
	subtasks: Subtask[];
	members: UserSummary[];
	onAddSubtask: (title: string) => void;
	onUpdateStatus: (subtaskId: string, status: Task["status"]) => void;
	onUpdatePriority: (subtaskId: string, priority: Task["priority"]) => void;
	onUpdateAssignee: (subtaskId: string, assigneeId: string | null) => void;
	onDelete: (subtaskId: string) => void;
}

export function TaskDetailsSubtasks({
	subtasks,
	members,
	onAddSubtask,
	onUpdateStatus,
	onUpdatePriority,
	onUpdateAssignee,
	onDelete,
}: TaskDetailsSubtasksProps) {
	const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
	const [isAddingSubtask, setIsAddingSubtask] = useState(false);

	function handleAdd() {
		if (!newSubtaskTitle.trim()) return;
		onAddSubtask(newSubtaskTitle.trim());
		setNewSubtaskTitle("");
		setIsAddingSubtask(false);
	}

	return (
		<section>
			<Collapsible className="group/collapsible space-y-4" defaultOpen>
				<CollapsibleTrigger className="w-full cursor-pointer">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2 text-sm font-medium">
							<ChevronDown fill="currentColor" stroke="0" className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" />
							Subtasks ({subtasks.length})
						</div>
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<div className="overflow-hidden rounded-lg border">
						<Table className="text-sm bg-background">
							<TableHeader>
								<TableRow className="bg-background">
									<TableHead className="px-3">Task</TableHead>
									<TableHead>Priority</TableHead>
									<TableHead>Members</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right px-3">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{subtasks.map((subtask) => (
									<TableRow key={subtask.id}>
										<TableCell className="px-3 font-medium">
											{subtask.title}
										</TableCell>

										<TableCell>
											<PrioritySelect
												priority={subtask.priority}
												onSelect={(p) => onUpdatePriority(subtask.id, p)}
											/>
										</TableCell>

										<TableCell>
											<MemberSelect
												members={members}
												selectedMemberId={subtask.assignee?.id}
												onSelect={(assigneeId) => onUpdateAssignee(subtask.id, assigneeId)}
												trigger={
													<button type="button" className="flex items-center gap-2 text-xs cursor-pointer border-0 bg-transparent p-0">
														{subtask.assignee ? (
															<Avatar className="size-6 rounded-full">
																<AvatarImage src={subtask.assignee.avatarUrl ?? undefined} />
																<AvatarFallback>{subtask.assignee.name.slice(0, 1)}</AvatarFallback>
															</Avatar>
														) : (
															<span className="size-6 inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
																<Plus size={12} />
															</span>
														)}
													</button>
												}
											/>
										</TableCell>

										<TableCell>
											<StatusSelect
												status={subtask.status}
												onSelect={(s) => onUpdateStatus(subtask.id, s)}
												trigger={
													<button type="button" className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity border-0 cursor-pointer ${statusColors[subtask.status]}`}>
														<span className="size-1.5 rounded-full bg-current" />
														{statusLabels[subtask.status]}
														<ChevronDown className="size-3" />
													</button>
												}
											/>
										</TableCell>

										<TableCell className="text-right">
											<ConfirmDeleteDialog
												title="Delete subtask?"
												description={`Are you sure you want to delete "${subtask.title}"? This action cannot be undone.`}
												onConfirm={() => onDelete(subtask.id)}
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
								))}
							</TableBody>

							<TableFooter className="bg-background">
								<TableRow className="border-0">
									<TableCell colSpan={5} className="p-2">
										{isAddingSubtask ? (
											<div className="flex items-center gap-2">
												<InputGroup className={cn(NO_FOCUS_BORDER_CLASS, "w-full")}>
													<InputGroupInput
														placeholder="Subtask title..."
														value={newSubtaskTitle}
														onChange={(e) => setNewSubtaskTitle(e.target.value)}
														onKeyDown={(e) => {
															if (e.key === "Enter") handleAdd();
															if (e.key === "Escape") setIsAddingSubtask(false);
														}}
														autoFocus
														className="h-8 text-xs"
													/>
													<InputGroupAddon align={"inline-end"}>
														<Button size="icon-lg" onClick={handleAdd}>
															<CornerDownLeft />
														</Button>
														<Button size="icon-lg" variant="ghost" onClick={() => setIsAddingSubtask(false)}>
															<X />
														</Button>
													</InputGroupAddon>
												</InputGroup>
											</div>
										) : (
											<Button
												variant="outline"
												size="xs"
												className="rounded-3xl border-0 py-0 h-8"
												onClick={() => setIsAddingSubtask(true)}
											>
												<Plus />
												Add Subtask
											</Button>
										)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</section>
	);
}
