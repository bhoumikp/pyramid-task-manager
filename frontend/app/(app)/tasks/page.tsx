import { TaskShell } from "@/components/tasks/task-shell";

export default function TasksPage() {
  return (
    <main className="flex h-full min-h-0 flex-col p-4 pb-0 gap-4">
      <TaskShell />
    </main>
  );
}