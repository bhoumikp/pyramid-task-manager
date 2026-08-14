import { ChevronDown, Ellipsis, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TaskCol } from "./task-data";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function TaskTable({ table }: { table: TaskCol }) {
  return (
    <Collapsible
      className="group/collapsible space-y-4"
      defaultOpen
    >
      <CollapsibleTrigger className="flex cursor-pointer items-center gap-1 text-sm font-medium">
        <ChevronDown
          className="transition-transform duration-200 group-not-data-open/collapsible:-rotate-90"
          size={16}
          fill="currentColor"
          stroke="none"
        />
        {table.title}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="overflow-hidden rounded-lg border">
          <Table className="font-medium">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%] min-w-[200px] px-3">
                  Task
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="max-w-0 px-3">
                    <span className="block truncate">
                      {task.title}
                    </span>
                  </TableCell>

                  <TableCell>
                    {task.priority ? (
                      <Badge variant="secondary">
                        {task.priority}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">
                        No priority
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      	<Avatar className="h-8 w-8 rounded-lg">
							<AvatarImage
								src={task.assignee.avatarUrl ?? undefined}
								alt={task.assignee.name}
							/>
							<AvatarFallback>
								{task.assignee.name.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
                    </div>
                  </TableCell>

                  <TableCell>
                    {task.dueDate || (
                      <span className="text-muted-foreground">
                        No date
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="border-0"
                    >
                      <Ellipsis size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter className="bg-background">
              <TableRow>
                <TableCell colSpan={5}>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="rounded-3xl border-0"
                  >
                    <Plus />
                    Add Task
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}