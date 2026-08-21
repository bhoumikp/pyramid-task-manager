import { useState } from "react";
import {
	Check,
	Eye,
	Lock,
	MoreHorizontal,
	PanelRight,
	Share2,
	Unlock,
	X,
} from "lucide-react";

import type { Task } from "@/lib/tasks";
import { Button } from "../../ui/button";

interface TaskDetailsHeaderProps {
	task: Task;
	isEditingTitle: boolean;
	titleInput: string;
	isEditingDesc: boolean;
	descInput: string;
	showSidebar?: boolean;
	onToggleSidebar?: () => void;
	onTogglePrivate?: () => void;
	onToggleWatch?: () => void;
	onTitleInputChange: (value: string) => void;
	onSaveTitle: () => void;
	onCancelTitle: () => void;
	onStartEditTitle: () => void;
	onDescInputChange: (value: string) => void;
	onSaveDescription: () => void;
	onCancelDescription: () => void;
	onStartEditDesc: () => void;
}

export function TaskDetailsHeader({
	task,
	isEditingTitle,
	titleInput,
	isEditingDesc,
	descInput,
	showSidebar = true,
	onToggleSidebar,
	onTogglePrivate,
	onToggleWatch,
	onTitleInputChange,
	onSaveTitle,
	onCancelTitle,
	onStartEditTitle,
	onDescInputChange,
	onSaveDescription,
	onCancelDescription,
	onStartEditDesc,
}: TaskDetailsHeaderProps) {
	// Derive states directly from backend task data
	const isPrivate = Boolean(task.isPrivate);
	const watcherCount = task.watchers?.length || 0;
	const isWatching = Boolean(task.watchers && task.watchers.length > 0);
	const [copied, setCopied] = useState(false);

	function handleShare() {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}
	return (
		<header className="flex items-start justify-between md:flex-wrap gap-4">
			<div className="min-w-0 w-6xl space-y-2.5">
				{isEditingTitle ? (
					<div className="flex flex-col items-end gap-2 w-full">
						<textarea
							value={titleInput}
							onChange={(e) => onTitleInputChange(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									onSaveTitle();
								}
								if (e.key === "Escape") onCancelTitle();
							}}
							autoFocus
							className="w-full field-sizing-content min-h-10 resize-none text-xl font-semibold rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<div className="flex flex-row gap-1 shrink-0 pt-1">
							<Button size="icon-lg" onClick={onSaveTitle}>
								<Check size={14} />
							</Button>
							<Button size="icon-lg" variant="ghost" onClick={onCancelTitle}>
								<X size={14} />
							</Button>
						</div>
					</div>
				) : (
					<h1
						onClick={onStartEditTitle}
						className="text-2xl font-semibold rounded-md cursor-text hover:text-primary hover:bg-muted/50 transition-colors truncate"
						title={task.title || "Click to edit title"}
					>
						{task.title}
					</h1>
				)}

				{isEditingDesc ? (
					<div className="space-y-2 max-w-6xl">
						<textarea
							value={descInput}
							onChange={(e) => onDescInputChange(e.target.value)}
							className="w-full field-sizing-content min-h-10 resize-none rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							placeholder="Add task description..."
							autoFocus
						/>
						<div className="flex items-center gap-2">
							<Button size="lg" onClick={onSaveDescription}>
								Save
							</Button>
							<Button size="lg" variant="ghost" onClick={onCancelDescription}>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<p
						onClick={onStartEditDesc}
						className="py-2 rounded-md text-sm text-muted-foreground cursor-text hover:text-foreground hover:bg-muted transition-colors truncate"
						title={task.description || "Click to edit description"}
					>
						{task.description || (
							<span className="italic text-muted-foreground">
								Click to add a detailed description...
							</span>
						)}
					</p>
				)}
			</div>

			<div className="flex items-center gap-2">
				{/* Private Toggle Button */}
				<Button
					variant="outline"
					size="icon-lg"
					className={`rounded cursor-pointer transition-colors ${isPrivate
						? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400"
						: "hover:bg-accent"
						}`}
					onClick={onTogglePrivate}
					title={isPrivate ? "Task is Private (Click to make public)" : "Task is Public (Click to make private)"}
				>
					{isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
				</Button>

				{/* Watchers Button */}
				<Button
					variant="outline"
					size="lg"
					className={`rounded px-3 text-xs cursor-pointer transition-colors gap-1.5 ${isWatching
						? "bg-primary/10 text-primary border-primary/30 font-medium"
						: "text-muted-foreground hover:text-foreground"
						}`}
					onClick={onToggleWatch}
					title={isWatching ? "Watching task (Click to unwatch)" : "Watch task for updates"}
				>
					<Eye size={14} />
					<span>{watcherCount}</span>
				</Button>

				{/* Share Button */}
				<Button
					variant="outline"
					size="icon-lg"
					className={`rounded cursor-pointer transition-colors ${copied ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : ""
						}`}
					onClick={handleShare}
					title={copied ? "Link Copied!" : "Share link"}
				>
					{copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
				</Button>

				<Button variant="outline" size="icon-lg" className="rounded cursor-pointer">
					<MoreHorizontal size={14} />
				</Button>
				<Button
					variant={showSidebar ? "secondary" : "outline"}
					size="icon-lg"
					className="rounded cursor-pointer"
					onClick={onToggleSidebar}
					title={showSidebar ? "Hide sidebar" : "Show sidebar"}
				>
					<PanelRight size={14} />
				</Button>
			</div>
		</header>
	);
}
