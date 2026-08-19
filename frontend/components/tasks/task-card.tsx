import { Calendar, Ellipsis, Signal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { formatTaskDate, taskPriorityLabels, Task, TaskFieldState } from "@/lib/tasks";
import Link from "next/link";

export function TaskCard({
	taskData,
	visibleFields,
} : {
	taskData: Task;
	visibleFields: TaskFieldState;
}) {
	const formattedDueDate = formatTaskDate(taskData.dueDate, "short");

	return (
		<Card className="min-w-0 rounded-lg gap-4">
			<CardHeader className="flex justify-between items-start">
				<CardTitle className="min-w-0 max-w-[90%] text-sm">
					<Link href={`/tasks/${taskData.id}`} className="hover:underline">
						{taskData.title}
					</Link>
				</CardTitle>
				<Ellipsis className="cursor-pointer" size={14}/>
			</CardHeader>

			{(visibleFields.members || visibleFields.dueDate || visibleFields.priority) && (
				<CardContent className="flex flex-col gap-3">
					<div className="flex justify-between items-center gap-2">
						{visibleFields.members && (
							<div className="flex min-w-0 items-center gap-1 font-medium">
								{taskData.assignee ? (
									<>
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={taskData.assignee.avatarUrl ?? undefined}
												alt={taskData.assignee.name}
											/>
											<AvatarFallback>
												{taskData.assignee.name.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="truncate">
											{taskData.assignee.name}
										</span>
									</>
								) : (
									<span className="text-xs text-muted-foreground">
										Unassigned
									</span>
								)}
							</div>
						)}
						{visibleFields.dueDate && formattedDueDate && (
							<Badge variant="destructive">
								<Calendar />
								{formattedDueDate}
							</Badge>
						)}
					</div>
					{visibleFields.priority && taskData.priority !== "NONE" && (
						<Badge variant="secondary" className="w-fit text-xs">
							<Signal />
							{taskPriorityLabels[taskData.priority]}
						</Badge>
					)}
				</CardContent>
			)}
		</Card>
	)
}
