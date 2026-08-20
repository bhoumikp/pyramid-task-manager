"use client";

import { useEffect, useState } from "react";
import { ChevronDown, LucideIcon, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getProjects } from "@/lib/api";
import { type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { ProjectAddDialog } from "@/components/projects/project-add-dialog";

export function SidebarNavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
	}[];
}) {
	const pathname = usePathname();
	const [projects, setProjects] = useState<Project[]>([]);
	const [openProjects, setOpenProjects] = useState(true);

	useEffect(() => {
		if (pathname.startsWith("/projects")) {
			setOpenProjects(true);
		}
	}, [pathname]);

	useEffect(() => {
		async function fetchProjects() {
			try {
				const data = await getProjects();
				if (Array.isArray(data)) {
					setProjects(data);
				}
			} catch (e) {
				console.warn("Could not fetch remote projects for sidebar", e);
			}
		}

		void fetchProjects();
	}, [pathname]);

	return (
		<SidebarGroup>
			<Collapsible className="group/collapsible" defaultOpen={true}>
				<CollapsibleTrigger className="w-full">
					<SidebarGroupLabel className="flex cursor-pointer justify-between text-sm text-sidebar-foreground px-3">
						Workspace
						<ChevronDown className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" />
					</SidebarGroupLabel>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenu>
						{items.map((item, index) => {
							const active =
								item.isActive ??
								(pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url + "/")));

							const isProjectsItem = item.url === "/projects";

							if (isProjectsItem) {
								return (
									<Collapsible
										key={index}
										open={openProjects}
										onOpenChange={setOpenProjects}
										className="group/projects-collapsible"
									>
										<SidebarMenuItem>
											<div className="flex items-center justify-between w-full pr-1">

												<CollapsibleTrigger
													nativeButton={false}
													render={
														<SidebarMenuButton
															isActive={active}
															render={<Link href={item.url} />}
															className={cn(
																"py-2 px-3 rounded-xl text-sidebar-accent-foreground transition-colors flex-1 justify-between",
																active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
															)}
														>
															<div className="flex items-center gap-2">
																{item.icon && <item.icon />}
																<span>{item.title}</span>
															</div>
															<ChevronDown className="size-3.5 transition-transform duration-200 group-not-data-open/projects-collapsible:-rotate-90" />
														</SidebarMenuButton>
													}
												/>
											</div>

											<CollapsibleContent>
												<SidebarMenuSub className="my-1 gap-0.5">
													{projects.map((proj) => {
														const isSubActive = pathname === `/projects/${proj.id}`;
														return (
															<SidebarMenuSubItem key={proj.id}>
																<SidebarMenuSubButton
																	isActive={isSubActive}
																	render={<Link href={`/projects/${proj.id}`} />}
																	className={cn(
																		"px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer",
																		isSubActive
																			? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
																			: "text-foreground"
																	)}
																>
																	<span className="truncate">{proj.title}</span>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														);
													})}
													<SidebarMenuSubItem>
														<ProjectAddDialog
															nativeButton={false}
															trigger={
																<SidebarMenuSubButton
																	className="px-3 py-1.5 rounded-lg hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 w-full"
																>
																	<Plus size={12} />
																	<span className="text-xs font-medium">Add Project</span>
																</SidebarMenuSubButton>
															}
														/>
													</SidebarMenuSubItem>
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								);
							}

							return (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton
										isActive={active}
										render={<Link href={item.url} />}
										className={cn(
											"py-2 px-3 rounded-xl text-sidebar-accent-foreground transition-colors",
											active && "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
										)}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</CollapsibleContent>
			</Collapsible>
		</SidebarGroup>
	);
}