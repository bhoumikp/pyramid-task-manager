import { TaskCol, TaskFieldState } from "@/lib/tasks";
import { TaskTable } from "./task-table";

export function TaskList({
	columns,
	visibleFields,
} : {
	columns  :TaskCol[];
	visibleFields: TaskFieldState;
}) {
	return (
		<div className="space-y-4">
			{columns.map(column => (
				<TaskTable
					key={column.id}
					table={column}
					visibleFields={visibleFields}
				/>
			))}
		</div>
	)
}
