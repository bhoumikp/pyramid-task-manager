import { useState } from "react";
import {
	ChevronDown,
	Ellipsis,
	Paperclip,
	SendHorizontal,
	Trash2,
} from "lucide-react";

import {
	formatRelativeTime,
	type CommentItem,
	type UserSummary,
} from "@/lib/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { ConfirmDeleteDialog } from "@/components/app/confirm-delete-dialog";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../../ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../ui/input-group";
import { cn, NO_FOCUS_BORDER_CLASS } from "@/lib/utils";

interface TaskDetailsCommentsProps {
	comments: CommentItem[];
	currentUser: UserSummary;
	onPostComment: (content: string, parentId?: string) => void;
	onDeleteComment: (commentId: string) => void;
}

export function TaskDetailsComments({
	comments,
	currentUser,
	onPostComment,
	onDeleteComment,
}: TaskDetailsCommentsProps) {
	const [mainCommentText, setMainCommentText] = useState("");
	const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
	const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);

	function handleSubmit(parentId?: string) {
		const text = parentId ? replyTexts[parentId] : mainCommentText;
		if (!text || !text.trim()) return;

		onPostComment(text.trim(), parentId);

		if (parentId) {
			setReplyTexts((prev) => ({ ...prev, [parentId]: "" }));
		} else {
			setMainCommentText("");
		}
	}

	return (
		<section className="space-y-5">
			<h3 className="text-sm font-medium">Comments ({comments.length})</h3>

			<ul className="space-y-5">
				{comments.map((comment) => (
					<li key={comment.id} className="border rounded-md">
						{/* Main Comment Header & Body */}
						<div className="space-y-2 p-4">
							<div className="flex justify-between">
								<div className="flex items-center gap-2">
									<Avatar className="h-7 w-7 rounded-full">
										<AvatarImage src={comment.author.avatarUrl ?? undefined} alt={comment.author.name} />
										<AvatarFallback>
											{comment.author.name.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<span className="text-xs font-medium">{comment.author.name}</span>
									<span className="text-xs text-muted-foreground">
										{formatRelativeTime(comment.createdAt)}
									</span>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="ghost" size="icon-xs" className="border-0">
												<Ellipsis size={14} />
											</Button>
										}
									/>
									<DropdownMenuContent align="end">
										<DropdownMenuItem
											className="text-destructive text-xs gap-2 cursor-pointer"
											onClick={() => setCommentToDeleteId(comment.id)}
										>
											<Trash2 size={12} /> Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>

								<ConfirmDeleteDialog
									open={commentToDeleteId === comment.id}
									onOpenChange={(open) => {
										if (!open) setCommentToDeleteId(null);
									}}
									title="Delete comment?"
									description="Are you sure you want to delete this comment? This action cannot be undone."
									onConfirm={() => onDeleteComment(comment.id)}
								/>
							</div>
							<p className="text-sm text-foreground">{comment.content}</p>
						</div>

						{/* Replies List */}
						{comment.replies && comment.replies.length > 0 && (
							<Collapsible defaultOpen className="border-t group/collapsible">
								<div className="flex items-center gap-2 px-4 py-2 bg-muted/20">
									<CollapsibleTrigger
										render={
											<button
												type="button"
												className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-0 bg-transparent p-0"
											>
												<ChevronDown className="size-3.5 transition-transform duration-200 group-data-open/collapsible:rotate-0 -rotate-90" />
												<span>
													{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
												</span>
											</button>
										}
									/>
								</div>
								<CollapsibleContent>
									<div className="bg-muted/30 border-t space-y-4 pl-8 pr-4 py-3">
										{comment.replies.map((reply) => (
											<div key={reply.id} className="flex gap-2.5 items-start">
												<Avatar className="h-6 w-6 rounded-full">
													<AvatarImage src={reply.author.avatarUrl ?? undefined} />
													<AvatarFallback>{reply.author.name.slice(0, 1)}</AvatarFallback>
												</Avatar>
												<div className="flex-1 text-xs space-y-1">
													<div className="flex items-center gap-2">
														<span className="font-medium">{reply.author.name}</span>
														<span className="text-muted-foreground">
															{formatRelativeTime(reply.createdAt)}
														</span>
													</div>
													<p className="text-foreground">{reply.content}</p>
												</div>
											</div>
										))}
									</div>
								</CollapsibleContent>
							</Collapsible>
						)}

						{/* Leave a reply input */}
						<div className="flex gap-2.5 px-4 py-3 border-t">
							<Avatar className="h-7 w-7 rounded-full">
								<AvatarImage src={currentUser.avatarUrl ?? undefined} />
								<AvatarFallback>
									{currentUser.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<InputGroup className={cn("border-0 gap-4 flex-1", NO_FOCUS_BORDER_CLASS)}>
								<InputGroupInput
									className="text-accent-foreground text-xs"
									placeholder="Leave a reply..."
									value={replyTexts[comment.id] || ""}
									onChange={(e) =>
										setReplyTexts((prev) => ({
											...prev,
											[comment.id]: e.target.value,
										}))
									}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleSubmit(comment.id);
									}}
								/>
								<InputGroupAddon align="inline-end">
									<Paperclip className="text-primary" size={16} />
								</InputGroupAddon>
								<InputGroupAddon
									className="text-primary cursor-pointer hover:opacity-80"
									align="inline-end"
									onClick={() => handleSubmit(comment.id)}
								>
									<SendHorizontal size={16} />
								</InputGroupAddon>
							</InputGroup>
						</div>
					</li>
				))}
			</ul>

			{/* Top-level comment box */}
			<div className="px-2 py-3 border rounded-md">
				<InputGroup className={cn("border-0 gap-4 rounded", NO_FOCUS_BORDER_CLASS)}>
					<InputGroupInput
						className="text-accent-foreground text-sm"
						placeholder="Add a comment..."
						value={mainCommentText}
						onChange={(e) => setMainCommentText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSubmit();
						}}
					/>
					<InputGroupAddon align="inline-end">
						<Paperclip className="text-primary" size={16} />
					</InputGroupAddon>
					<InputGroupAddon
						className="text-primary cursor-pointer hover:opacity-80"
						align="inline-end"
						onClick={() => handleSubmit()}
					>
						<SendHorizontal size={16} />
					</InputGroupAddon>
				</InputGroup>
			</div>
		</section>
	);
}
