"use client";

import * as React from "react";
import { User } from "lucide-react";

import type { UserSummary } from "@/lib/tasks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";

interface MemberSelectProps {
	members: UserSummary[];
	selectedMemberId?: string | null;
	onSelect: (memberId: string | null) => void;
	trigger?: React.ReactElement;
	align?: "start" | "center" | "end";
	className?: string;
	title?: string;
	nativeButton?: boolean;
}

export function MemberSelect({
	members,
	selectedMemberId,
	onSelect,
	trigger,
	align = "start",
	className = "w-48",
	title = "Assign to Member",
	nativeButton = true,
}: MemberSelectProps) {
	const selectedMember = members.find((m) => m.id === selectedMemberId);

	const defaultTrigger = (
		<Button variant="outline" size="sm" className="h-8 justify-start gap-2 text-xs cursor-pointer w-full">
			{selectedMember ? (
				<>
					<Avatar className="size-4 rounded-full">
						<AvatarImage src={selectedMember.avatarUrl ?? undefined} alt={selectedMember.name} />
						<AvatarFallback>{selectedMember.name.slice(0, 1).toUpperCase()}</AvatarFallback>
					</Avatar>
					<span className="truncate">{selectedMember.name}</span>
				</>
			) : (
				<span className="text-muted-foreground flex items-center gap-1.5">
					<User className="size-3.5" />
					Unassigned
				</span>
			)}
		</Button>
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger nativeButton={nativeButton} render={trigger ?? defaultTrigger} />
			<DropdownMenuContent align={align} className={className}>
				{title && (
					<div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
						{title}
					</div>
				)}

				<DropdownMenuItem
					onClick={() => onSelect(null)}
					className="flex items-center gap-2 text-sm px-2 py-1.5 cursor-pointer"
				>
					<Avatar className="flex items-center justify-center size-7 rounded-full text-muted-foreground bg-muted">
						<User className="size-4" />
					</Avatar>
					<span>Unassigned</span>
				</DropdownMenuItem>

				{members.map((m) => (
					<DropdownMenuItem
						key={m.id}
						onClick={() => onSelect(m.id)}
						className="flex items-center gap-2 text-sm px-2 py-1.5 cursor-pointer"
					>
						<Avatar className="size-7">
							<AvatarImage src={m.avatarUrl ?? undefined} alt={m.name} />
							<AvatarFallback>{m.name.slice(0, 1).toUpperCase()}</AvatarFallback>
						</Avatar>
						<span>{m.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
