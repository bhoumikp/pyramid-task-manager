import { Calendar, Ellipsis, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Task } from "./task-data";
import { Button } from "../ui/button";

export function TaskCard({taskData} : { taskData: Task}) {
	const visibleLabels = taskData.labels.slice(0, 2);
	const hiddenLabelsCount = taskData.labels.length - visibleLabels.length;

	return (
		<Card className="min-w-0 rounded-lg gap-4">
			<CardHeader className="flex justify-between items-center gap-2">
				<CardTitle className="min-w-0 max-w-[90%] truncate text-sm">{taskData.title}</CardTitle>
				<Ellipsis className="cursor-pointer" size={14}/>
			</CardHeader>

			<CardContent className="flex flex-col gap-3">
				<div className="flex justify-between items-center">
					<div className="flex min-w-0 items-center gap-1 font-medium">
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
					</div>
					<Badge variant={"destructive"}>
						<Calendar />
						{taskData.dueDate}
					</Badge>
				</div>
				<div className="flex flex-wrap gap-1.5">
					{visibleLabels.map(label => (
						<Badge key={label} variant="secondary" className="text-xs">
						<Tag />
						{label}
						</Badge>
					))}

					{hiddenLabelsCount > 0 && (
						<Badge variant="outline" className="text-xs">
						+{hiddenLabelsCount}
						</Badge>
					)}
				</div>
			</CardContent>
		</Card>
	)
}