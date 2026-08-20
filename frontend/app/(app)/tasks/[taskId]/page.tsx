import { TaskDetails } from "@/components/tasks/details/task-details";

export default async function TaskDetailsPage({params,}: {params: Promise<{ taskId: string }>}) {
	const { taskId } = await params;

	return (
		<main className="p-4">
			<TaskDetails taskId={taskId} />
		</main>
	);
}