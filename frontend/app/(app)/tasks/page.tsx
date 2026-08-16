import { TaskHeader } from "@/components/tasks/task-header";
import { TaskContent } from "@/components/tasks/tasks-content";

export default function TasksPage() {
  return (
    <main className="flex h-full min-h-0 flex-col p-4 pb-0 gap-4">
        <TaskHeader />
        {/* <div className="flex min-h-0 flex-1 flex-col gap-4 p-2 overflow-hidden">
          <ClientOnly>
            <TaskBoard />
          </ClientOnly>
        </div> */}
       {/* <div className="min-h-0 flex-1 overflow-y-auto p-2 no-scrollbar"> */}
          <TaskContent />
       {/* </div> */}
    </main>
  );
}