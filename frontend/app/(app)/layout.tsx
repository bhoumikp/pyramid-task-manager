import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
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
	<SidebarProvider>
		<AppSidebar user={user}/>

		<SidebarInset>
		{children}
		</SidebarInset>
	</SidebarProvider>
  );
}