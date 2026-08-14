import { taskCols } from "./task-data";
import { TaskTable } from "./task-table";

export function TaskList() {
	return (
		<div className="space-y-4">
			{taskCols.map(column => <TaskTable key={column.id} table={column} /> )}
		</div>
	)
}