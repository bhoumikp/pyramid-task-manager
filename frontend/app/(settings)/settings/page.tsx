import { getServerCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function SettingsPage() {
	const user = await getServerCurrentUser();

	const fallbackUser = {
		id: user?.id || "guest",
		name: user?.name || "Dexter",
		email: user?.email || "dexter@gmail.com",
		username: user?.username || "Dexuser",
		title: user?.title || "Designer",
		avatarUrl: user?.avatarUrl || null,
	};

	return (
		<div className="h-full flex justify-center items-center p-4">
			<div className="max-w-2xl w-full space-y-10">
				{/* Page Header */}
				<h1 className="text-2xl font-semibold tracking-tight text-foreground px-6 mb-4">Profile</h1>

				{/* Interactive Profile Form */}
				<ProfileForm user={fallbackUser} />
			</div>
		</div>
	);
}
