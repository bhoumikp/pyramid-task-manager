import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/app/app-header";
import { BreadcrumbProvider } from "@/contexts/breadcrumb-context";
import { ProjectsProvider } from "@/contexts/projects-context";
import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const user = await getServerCurrentUser();

	if (!user) {
		redirect("/login");
	}

  return (
	<BreadcrumbProvider>
		<ProjectsProvider>
			<SidebarProvider className="h-svh">
				<AppSidebar user={user}/>

				<SidebarInset className="flex min-h-0 flex-1 flex-col">
					<AppHeader />
					<div className="min-h-0 flex-1 overflow-y-auto">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</ProjectsProvider>
	</BreadcrumbProvider>
  );
}
