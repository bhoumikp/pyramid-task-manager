import { GalleryVerticalEnd, LayoutDashboard, LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

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



export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<NavUser user={user}/>
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={items} />
			</SidebarContent>
		</Sidebar>
	)
}