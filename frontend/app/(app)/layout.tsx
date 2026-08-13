import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { AppHeader } from "@/components/app/app-header";
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
	<SidebarProvider className="h-svh overflow-hidden">
		<AppSidebar user={user}/>

		<SidebarInset className="min-h-0 overflow-hidden">
			<AppHeader />
			<div className="flex min-h-0 flex-1 flex-col">
				{children}
			</div>
		</SidebarInset>
	</SidebarProvider>
  );
}