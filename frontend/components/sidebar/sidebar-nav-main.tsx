"use client";

import {
	ChevronDown,
	LucideIcon,
} from "lucide-react"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function SidebarNavMain({
	items,
}: {
	items: {
		title: string
		url: string
		icon?: LucideIcon,
		isActive?: boolean
	}[]
}) {
	const pathname = usePathname();

	return (
		<SidebarGroup>
			<Collapsible
				className="group/collapsible"
				defaultOpen={true}
			>
				<CollapsibleTrigger className={"w-full"}>
					<SidebarGroupLabel className="flex cursor-pointer justify-between text-sm text-sidebar-foreground px-3">
						Workspace
						<ChevronDown className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" />
					</SidebarGroupLabel>

				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenu>
						{items.map((item, index) => {
							const active = item.isActive ?? (pathname === item.url || pathname.startsWith(item.url + "/"));
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
	)
}