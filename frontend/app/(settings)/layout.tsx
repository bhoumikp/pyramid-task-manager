import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/lib/auth";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";

export default async function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getServerCurrentUser();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="flex h-screen w-full bg-background overflow-hidden">
			{/* Settings Dedicated Sidebar */}
			<SettingsSidebar />

			{/* Main Settings Content Area */}
			<main className="flex-1 overflow-y-auto p-8 lg:p-12">
				{children}
			</main>
		</div>
	);
}
