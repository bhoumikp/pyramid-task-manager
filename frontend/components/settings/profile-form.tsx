"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X, Loader2, AlertTriangle } from "lucide-react";
import { updateProfileApi, leaveWorkspaceApi } from "@/lib/api";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type UserProfile = {
	id: string;
	name: string;
	username: string;
	email: string | null;
	title: string | null;
	avatarUrl: string | null;
};

export function ProfileForm({ user }: { user: UserProfile }) {
	const router = useRouter();

	const [name, setName] = useState(user.name || "");
	const [title, setTitle] = useState(user.title || "");
	const [username, setUsername] = useState(user.username || "");
	const [email, setEmail] = useState(user.email || "");

	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	async function handleSaveProfile(field?: { [key: string]: string }) {
		try {
			setIsSaving(true);
			setError(null);
			setSuccessMsg(null);

			const payload = field || {
				name,
				title,
				username,
				email,
			};

			const updated = await updateProfileApi(payload);
			setName(updated.name || "");
			setTitle(updated.title || "");
			setUsername(updated.username || "");
			setEmail(updated.email || "");

			setIsEditingEmail(false);
			setSuccessMsg("Profile saved successfully");
			router.refresh();
		} catch (err: any) {
			setError(err.message || "Failed to update profile");
		} finally {
			setIsSaving(false);
		}
	}

	async function handleConfirmLeaveWorkspace() {
		try {
			setIsLeaving(true);
			await leaveWorkspaceApi();
			setIsLeaveDialogOpen(false);
			router.push("/login");
		} catch (err: any) {
			setError(err.message || "Failed to leave workspace");
			setIsLeaving(false);
		}
	}

	return (
		<div className="space-y-6">
			{/* Feedback Messages */}
			{error && (
				<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
					{error}
				</div>
			)}
			{successMsg && (
				<div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-medium">
					{successMsg}
				</div>
			)}

			{/* Profile Details Card */}
			<div className="border rounded-lg bg-card p-6 divide-y space-y-4">
				{/* Profile Picture */}
				<div className="flex items-center justify-between pb-4">
					<span className="text-xs font-medium text-foreground">Profile picture</span>
					<Avatar className="size-10 rounded-full">
						<AvatarImage src={user.avatarUrl || undefined} alt={name} />
						<AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
							{(name || "U").slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</div>

				{/* Email (Interactive Inline Editing) */}
				<div className="flex items-center justify-between py-4">
					<span className="text-xs font-medium text-foreground">Email</span>
					{isEditingEmail ? (
						<div className="flex items-center gap-2">
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-8 text-xs w-56 rounded-md bg-background"
								placeholder="Enter email address"
							/>
							<Button
								size="sm"
								className="h-8 px-2.5 rounded-md text-xs cursor-pointer"
								onClick={() => handleSaveProfile({ email })}
								disabled={isSaving}
							>
								{isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
							</Button>
							<Button
								size="sm"
								variant="ghost"
								className="h-8 px-2.5 rounded-md text-xs cursor-pointer"
								onClick={() => {
									setEmail(user.email || "");
									setIsEditingEmail(false);
								}}
							>
								<X className="size-3.5" />
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-foreground">
								{email || <span className="text-muted-foreground italic">No email set</span>}
							</span>
							<button
								type="button"
								className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer border-0 bg-transparent"
								aria-label="Edit email"
								onClick={() => setIsEditingEmail(true)}
							>
								<Pencil size={14} />
							</button>
						</div>
					)}
				</div>

				{/* Full name (Editable Field) */}
				<div className="flex items-center justify-between py-4">
					<span className="text-xs font-medium text-foreground">Full name</span>
					<Input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						onBlur={() => handleSaveProfile()}
						className="w-64 h-9 text-sm rounded-md bg-muted/30 font-medium focus-visible:bg-background"
					/>
				</div>

				{/* Title (Editable Field) */}
				<div className="flex items-center justify-between py-4">
					<div>
						<p className="text-xs font-medium text-foreground">Title</p>
						<p className="text-[11px] text-muted-foreground mt-0.5">Your job title or role</p>
					</div>
					<Input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={() => handleSaveProfile()}
						placeholder="e.g. Designer, Software Engineer"
						className="w-64 h-9 text-sm rounded-md bg-muted/30 font-medium focus-visible:bg-background"
					/>
				</div>

				{/* Username (Editable Field) */}
				<div className="flex items-center justify-between pt-4">
					<div>
						<p className="text-xs font-medium text-foreground">Username</p>
						<p className="text-[11px] text-muted-foreground mt-0.5">One word, like a nickname or first name</p>
					</div>
					<Input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						onBlur={() => handleSaveProfile()}
						className="w-64 h-9 text-sm rounded-md bg-muted/30 font-medium focus-visible:bg-background"
					/>
				</div>
			</div>

			{/* Workspace Access Section */}
			<div className="space-y-4 pt-2">
				<h2 className="text-sm font-medium text-foreground">Workspace access</h2>

				<div className="border rounded-lg bg-card p-6 flex items-center justify-between">
					<span className="text-xs font-medium text-muted-foreground">Remove yourself from the workspace</span>
					<Button
						variant="ghost"
						onClick={() => setIsLeaveDialogOpen(true)}
						className="bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 text-xs font-medium px-3 py-2 h-8 rounded-md cursor-pointer border-0"
					>
						Leave Workspace
					</Button>
				</div>
			</div>

			{/* Leave Workspace Modal Dialog */}
			<Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<div className="flex items-center gap-3">
							<div className="size-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
								<AlertTriangle size={20} />
							</div>
							<DialogTitle className="text-lg font-semibold">Leave Workspace?</DialogTitle>
						</div>
						<div>
							<DialogDescription className="text-sm text-muted-foreground mt-1">
								Are you sure you want to leave this workspace? You will be removed from all projects and logged out of your session.
							</DialogDescription>
						</div>
					</DialogHeader>

					<DialogFooter className="mt-4 gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsLeaveDialogOpen(false)}
							disabled={isLeaving}
							className="text-xs h-9 rounded-md cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleConfirmLeaveWorkspace}
							disabled={isLeaving}
							className="text-xs h-9 rounded-md cursor-pointer bg-red-600 hover:bg-red-700 text-white"
						>
							{isLeaving ? (
								<>
									<Loader2 className="size-3.5 animate-spin mr-1" />
									Leaving...
								</>
							) : (
								"Leave Workspace"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
