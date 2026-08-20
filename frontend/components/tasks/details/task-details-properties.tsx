import { useState } from "react";
import {
	Calendar,
	Paperclip,
	Plus,
	Tag,
	User,
	X,
} from "lucide-react";

import { formatTaskDate, type Task, type UserSummary } from "@/lib/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { MemberSelect } from "../member-select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Input } from "../../ui/input";

interface TaskDetailsPropertiesProps {
	task: Task;
	members: UserSummary[];
	dueDateInput: string;
	onDueDateInputChange: (value: string) => void;
	onUpdateTask: (updates: Partial<Task> & { assigneeId?: string | null }) => void;
}

export function TaskDetailsProperties({
	task,
	members,
	onUpdateTask,
}: TaskDetailsPropertiesProps) {
	const [newLabel, setNewLabel] = useState("");
	const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);

	const activeLabels = task.labels && task.labels.length > 0 ? task.labels : [];
	const dueDateFormatted = formatTaskDate(task.dueDate, "short");

	function handleAddLabel() {
		if (!newLabel.trim()) return;
		const currentLabels = task.labels || [];
		if (currentLabels.includes(newLabel.trim())) {
			setNewLabel("");
			setLabelPopoverOpen(false);
			return;
		}
		const updatedLabels = [...currentLabels, newLabel.trim()];
		setNewLabel("");
		setLabelPopoverOpen(false);
		onUpdateTask({ labels: updatedLabels });
	}

	function handleRemoveLabel(labelToRemove: string) {
		const currentLabels = task.labels || [];
		const updatedLabels = currentLabels.filter((l) => l !== labelToRemove);
		onUpdateTask({ labels: updatedLabels });
	}

	return (
		<section className="space-y-3">
			{/* Assignee */}
			<div className="flex items-center gap-4">
				<h2 className="min-w-[78px] py-1.5 text-sm font-medium text-muted-foreground">Properties</h2>
				<div className="flex min-w-0 flex-wrap items-center gap-2">
					<MemberSelect
						members={members}
						selectedMemberId={task.assignee?.id}
						onSelect={(assigneeId) => onUpdateTask({ assigneeId })}
						trigger={
							<Button variant="ghost" className="h-8 p-1 gap-2 border-0 hover:bg-accent rounded-md cursor-pointer">
								<div className="flex items-center gap-2">
									{task.assignee ? (
										<Avatar className="size-6 rounded-full">
											<AvatarImage src={task.assignee.avatarUrl ?? undefined} alt={task.assignee.name} />
											<AvatarFallback>
												{task.assignee.name.slice(0, 1).toUpperCase()}
											</AvatarFallback>
										</Avatar>
									) : (
										<Avatar className="flex justify-center items-center h-7 w-7 rounded-full">
											<User />
										</Avatar>
									)}
									<span className="text-sm font-medium">{task.assignee?.name ? task.assignee.name : "Unassigned"}</span>
								</div>
							</Button>
						}
					/>

					{/* Due Date badge / picker */}
					{dueDateFormatted && (
						<Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
							<Calendar className="size-3.5" />
							{dueDateFormatted}
						</Badge>
					)}
				</div>
			</div>

			{/* Labels */}
			<div className="flex items-center gap-4">
				<h2 className="min-w-[78px] py-1.5 text-sm font-medium text-muted-foreground">Labels</h2>
				<div className="flex flex-wrap items-center gap-2">
					{activeLabels.map((label) => (
						<Badge key={label} variant="secondary" className="gap-1.5 text-xs font-medium group">
							<Tag className="size-3" />
							{label}
							<button
								onClick={() => handleRemoveLabel(label)}
								className="text-muted-foreground hover:text-destructive opacity-70 group-hover:opacity-100 transition-opacity"
							>
								<X size={12} />
							</button>
						</Badge>
					))}

					<Popover open={labelPopoverOpen} onOpenChange={setLabelPopoverOpen}>
						<PopoverTrigger
							render={
								<Button variant="secondary" size={activeLabels.length === 0 ? "xs" : "icon-xs"}>
									<Plus size={14} />
									{activeLabels.length === 0 && <span className="text-xs">Add Label</span>}
								</Button>
							}
						/>
						<PopoverContent align="start" className="w-60 p-3 space-y-2">
							<div className="text-xs font-semibold">Add New Label</div>
							<div className="flex gap-2">
								<Input
									placeholder="Label name..."
									value={newLabel}
									onChange={(e) => setNewLabel(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleAddLabel();
									}}
									className="h-8 text-xs"
								/>
								<Button size="xs" onClick={handleAddLabel}>
									Add
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>

			{/* Resources */}
			<div className="flex items-center gap-4">
				<h2 className="min-w-[78px] py-1.5 text-sm font-medium text-muted-foreground">Resources</h2>
				<div className="flex items-center gap-2 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
					<Paperclip size={12} />
					<span>Add document or link...</span>
				</div>
			</div>
		</section>
	);
}
