import { ProjectTaskShell } from "@/components/projects/project-task-shell";

export default async function ProjectDetailsPage({
	params,
}: {
	params: Promise<{ projectId: string }>;
}) {
	const { projectId } = await params;
	return (
		<main className="h-full min-h-0 p-4">
			<ProjectTaskShell projectId={projectId} />
		</main>
	)
}
