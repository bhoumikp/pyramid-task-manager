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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatTaskDate, Task, TaskCol, TaskFieldState } from "@/lib/tasks";
import { MemberSelect } from "./member-select";
import { PrioritySelect } from "./priority-select";
import { useTasks } from "@/hooks/use-tasks";

export function TaskTable({
  table,
  visibleFields,
}: {
  table: TaskCol;
  visibleFields: TaskFieldState;
}) {
  const { members, updateExistingTask } = useTasks();

  const footerColSpan =
    2 +
    Number(visibleFields.priority) +
    Number(visibleFields.members) +
    Number(visibleFields.dueDate) +
    Number(visibleFields.reporter);

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
                {visibleFields.priority && <TableHead>Priority</TableHead>}
                {visibleFields.members && <TableHead>Members</TableHead>}
                {visibleFields.dueDate && <TableHead>Due Date</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.tasks.map((task: Task) => (
                <TableRow key={task.id}>
                  <TableCell className="max-w-0 px-3">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="block truncate max-w-xs sm:max-w-md hover:underline"
                      title={task.title}
                    >
                      {task.title}
                    </Link>
                  </TableCell>

                  {visibleFields.priority && (
                    <TableCell>
                      <PrioritySelect
                        priority={task.priority}
                        onSelect={(p) => void updateExistingTask(task.id, { priority: p })}
                      />
                    </TableCell>
                  )}

                  {visibleFields.members && (
                    <TableCell>
                      <MemberSelect
                        members={members}
                        selectedMemberId={task.assignee?.id}
                        onSelect={(assigneeId) => void updateExistingTask(task.id, { assigneeId })}
                        trigger={
                          <button type="button" className="flex items-center gap-2 text-xs cursor-pointer border-0 bg-transparent p-0">
                            {task.assignee ? (
                              <Avatar className="size-6 rounded-full">
                                <AvatarImage src={task.assignee.avatarUrl ?? undefined} />
                                <AvatarFallback>{task.assignee.name.slice(0, 1)}</AvatarFallback>
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
                  )}

                  {visibleFields.dueDate && (
                    <TableCell>
                      {task.dueDate ? (
                        formatTaskDate(task.dueDate)
                      ) : (
                        <span className="text-muted-foreground">
                          No date
                        </span>
                      )}
                    </TableCell>
                  )}

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
                <TableCell colSpan={footerColSpan}>
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
