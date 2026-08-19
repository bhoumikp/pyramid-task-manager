"use client";

import * as React from "react";
import Link from "next/link";

import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";

export function AppBreadcrumb() {
	const { items } = useBreadcrumbs();

	if (!items.length) {
		return null;
	}

	return (
		<Breadcrumb className="min-w-0">
			<BreadcrumbList className="min-w-0">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<React.Fragment key={`${item.label}-${index}`}>
							{index > 0 && <BreadcrumbSeparator />}
							<BreadcrumbItem className="min-w-0">
								{item.href && !isLast ? (
									<BreadcrumbLink asChild>
										<Link href={item.href} className="truncate">
											{item.label}
										</Link>
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className="truncate">
										{item.label}
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
