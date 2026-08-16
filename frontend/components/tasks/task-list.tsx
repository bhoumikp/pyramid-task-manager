import { TaskCol } from "@/lib/tasks";
import { TaskTable } from "./task-table";

export function TaskList({ columns } : { columns  :TaskCol[] }) {
	return (
		<div className="space-y-4">
			{columns.map(column => <TaskTable key={column.id} table={column} /> )}
		</div>
	)
}