import { BreadcrumbContext } from "@/contexts/breadcrumb-context";
import { useContext } from "react";

export function useBreadcrumbs() {
	const context = useContext(BreadcrumbContext);

	if (!context) {
		throw new Error("useBreadcrumbs must be used inside BreadcrumbProvider");
	}

	return context;
}