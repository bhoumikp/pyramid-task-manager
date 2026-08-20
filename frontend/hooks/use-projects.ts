import { ProjectsContext } from "@/contexts/projects-context";
import { useContext } from "react";

export function useProjects() {
	const context = useContext(ProjectsContext);

	if (!context) {
		throw new Error("useProjects must be used within a ProjectsProvider");
	}

	return context;
}
