import { Dot, Signal, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import type { Task } from "@/lib/tasks";
import { priorityColorClass } from "./task-details-constants";

export function PriorityIcon({ priority, className = "" }: { priority: Task["priority"]; className?: string }) {
	const color = priorityColorClass[priority];
	const combinedClass = `${color} ${className}`.trim();

	switch (priority) {
		case "NONE":
			return <Dot className={`size-4 ${combinedClass}`} />;
		case "LOW":
			return <SignalLow className={`size-4 ${combinedClass}`} />;
		case "MEDIUM":
			return <SignalMedium className={`size-4 ${combinedClass}`} />;
		case "HIGH":
			return <SignalHigh className={`size-4 ${combinedClass}`} />;
		case "URGENT":
			return <Signal className={`size-4 ${combinedClass}`} />;
		default:
			return <Dot className={`size-4 ${combinedClass}`} />;
	}
}
