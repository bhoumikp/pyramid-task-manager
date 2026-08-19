"use client";

import {
	createContext,
	useState,
} from "react";

export type BreadcrumbItem = {
	label: string;
	href?: string;
};

type BreadcrumbContextValue = {
	items: BreadcrumbItem[];
	setItems: (items: BreadcrumbItem[]) => void;
};

export const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(
	undefined,
);

export function BreadcrumbProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [items, setItems] = useState<BreadcrumbItem[]>([]);

	return (
		<BreadcrumbContext.Provider value={{ items, setItems }}>
			{children}
		</BreadcrumbContext.Provider>
	);
}

