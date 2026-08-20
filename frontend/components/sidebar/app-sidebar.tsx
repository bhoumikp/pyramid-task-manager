"use client";

import { GalleryVerticalEnd, LayoutDashboard, LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { SidebarNavUser } from "./sidebar-nav-user";
import { SidebarNavMain } from "./sidebar-nav-main";

type SidebarUser = {
  name: string;
  email?: string;
  avatarUrl?: string;
};

interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
}

const items: NavItem[] = [
  {
    title: "Tasks",
    url: "/tasks",
    icon: LayoutDashboard, 
  },
  {
    title: "Projects",
    url: "/projects",
    icon: GalleryVerticalEnd,
  },
];



export function AppSidebar({user}: {user: SidebarUser}) {
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarNavUser user={user}/>
			</SidebarHeader>

			<SidebarContent>
				<SidebarNavMain items={items} />
			</SidebarContent>
		</Sidebar>
	)
}