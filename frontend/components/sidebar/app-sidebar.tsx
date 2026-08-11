import { GalleryVerticalEnd, LayoutDashboard, LucideIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

type SidebarUser = {
  name: string;
  email: string;
  avatarUrl: string;
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