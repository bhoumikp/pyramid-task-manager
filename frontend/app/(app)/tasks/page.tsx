import { ClientOnly } from "@/components/client-only";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskHeader } from "@/components/tasks/task-header";

export default function TasksPage() {
  return (
    <main className="flex h-full min-h-0 flex-col overflow-hidden p-4 pb-0">
      <div className="flex min-h-0 flex-1 flex-col gap-5 p-2">
        <TaskHeader />
        <ClientOnly>
          <TaskBoard />
        </ClientOnly>
      </div>
    </main>
  );
}