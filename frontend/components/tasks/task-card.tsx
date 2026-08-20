import { Calendar, Ellipsis, Signal, Tag, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatTaskDate, Task, TaskFieldState } from "@/lib/tasks";
import Link from "next/link";
import { MemberSelect } from "./member-select";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "../ui/button";

export function TaskCard({
	taskData,
	visibleFields,
}: {
	taskData: Task;
	visibleFields: TaskFieldState;
}) {
	const { members, updateExistingTask } = useTasks();
	const formattedDueDate = formatTaskDate(taskData.dueDate, "short");

	async function handleAssigneeChange(assigneeId: string | null) {
		try {
			await updateExistingTask(taskData.id, { assigneeId });
		} catch (error) {
			console.error("Failed to update task assignee:", error);
		}
	}

	return (
		<Card className="min-w-0 rounded-lg gap-4">
			<CardHeader className="flex justify-between items-start">
				<CardTitle className="min-w-0 max-w-[90%] text-sm h-auto">
					<Link href={`/tasks/${taskData.id}`} className="hover:underline whitespace-normal break-words h-auto block" title={taskData.title}>
						{taskData.title}
					</Link>
				</CardTitle>
				<Ellipsis className="cursor-pointer" size={14} />
			</CardHeader>

			{(visibleFields.members || visibleFields.dueDate || visibleFields.priority) && (
				<CardContent className="flex flex-col gap-3">
					<div className="flex justify-between items-center gap-2">
						{visibleFields.members && (
							<div className="flex min-w-0 items-center gap-1">
								<MemberSelect
									members={members}
									selectedMemberId={taskData.assignee?.id}
									onSelect={(assigneeId) => void handleAssigneeChange(assigneeId)}
									nativeButton={false}
									trigger={
										<div
											className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left min-w-0 max-w-full"
											title={taskData.assignee ? `Assigned to ${taskData.assignee.name}` : "Unassigned"}
										>
											{taskData.assignee ? (
												<>
													<Avatar className="size-5 shrink-0">
														<AvatarImage
															src={taskData.assignee.avatarUrl ?? undefined}
															alt={taskData.assignee.name}
														/>
														<AvatarFallback className="text-xs">
															{taskData.assignee.name.slice(0, 1).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<span className="truncate text-xs font-medium">
														{taskData.assignee.name}
													</span>
												</>
											) : (
												<span className="text-xs flex items-center gap-1 hover:text-foreground">
													<Avatar className="flex justify-center items-center size-5 rounded-full shrink-0">
														<User size={12} />
													</Avatar>
													<span className="text-xs font-medium">Unassigned</span>
												</span>
											)}
										</div>
									}
								/>
							</div>
						)}
						{visibleFields.dueDate && formattedDueDate && (
							<Badge variant="destructive">
								<Calendar />
								{formattedDueDate}
							</Badge>
						)}
					</div>

					{taskData.labels && taskData.labels.length ? (
						<div className="flex gap-1.5">
							{taskData.labels.map((label) => (
								<Badge key={label} variant="secondary">
									<Tag size={12} />
									{label}
								</Badge>
							))}
						</div>
					) : null}
				</CardContent>
			)}
		</Card>
	)
}
