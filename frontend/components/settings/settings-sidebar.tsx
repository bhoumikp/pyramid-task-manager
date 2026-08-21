"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search, User, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { useAccent } from "../providers/accent-provider";

const settingsNav = [
	{
		title: "Profile",
		href: "/settings",
		icon: User,
	},
	{
		title: "Theme",
		href: "/settings/theme",
		icon: Sun,
	},
	{
		title: "Color",
		href: "/settings/color",
		isColor: true,
	},
];

export function SettingsSidebar() {
	const pathname = usePathname();
	const { accent } = useAccent();

	return (
		<aside className="w-64 border-r border-border bg-sidebar flex flex-col shrink-0 h-screen">
			{/* Back to app */}
			<header className="p-2">
				<Link href="/tasks" className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent rounded-lg">
					<ArrowLeft size={16} />
					<span>Back to app</span>
				</Link>
			</header>

			<main className="p-2 space-y-2">
				{/* Search */}
				<InputGroup className="max-w-xs rounded px-1.5">
					<InputGroupInput placeholder="Search" />
					<InputGroupAddon>
						<Search size={16} />
					</InputGroupAddon>
				</InputGroup>

				{/* Navigation List */}
				<nav className="space-y-1">
					{settingsNav.map((item) => {
						const isActive = pathname === item.href || (item.href === "/settings" && pathname === "/settings/profile");
						const Icon = item.icon;

						return (
							<Link
								key={item.title}
								href={item.href}
								className={cn(
									"flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-colors",
									isActive ? "bg-accent text-accent-foreground" : "hover:text-foreground hover:bg-accent"
								)}
							>
								{item.isColor ? (
									<div className="size-4 bg-primary rounded-xs shrink-0" data-accent={accent} />
								) : Icon ? (
									<Icon size={16} />
								) : null}
								<span>{item.title}</span>
							</Link>
						);
					})}
				</nav>
			</main>
		</aside>
	);
}
