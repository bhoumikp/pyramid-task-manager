"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Sun, Moon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeSettingsPage() {
	const { theme, setTheme } = useTheme();

	const themes = [
		{
			id: "light" as const,
			label: "Light Mode",
			description: "Clean, high-contrast light theme for daytime focus.",
			icon: Sun,
		},
		{
			id: "dark" as const,
			label: "Dark Mode",
			description: "Sleek, low-glare dark theme optimized for low light.",
			icon: Moon,
		},
	];

	return (
		<div className="max-w-2xl mx-auto space-y-8 py-4">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">Theme</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Customize your interface theme mode.
				</p>
			</div>

			{/* Theme Options Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{themes.map((item) => {
					const isSelected = theme === item.id;
					const Icon = item.icon;

					return (
						<button
							key={item.id}
							type="button"
							onClick={() => setTheme(item.id)}
							className={cn(
								"relative flex flex-col justify-between text-left p-5 rounded-lg border transition-all cursor-pointer bg-card",
								isSelected
									? "border-primary ring-2 ring-primary/20 shadow-xs"
									: "border-border/80 hover:border-border hover:bg-accent/40"
							)}
						>
							{/* Selection Checkmark Badge */}
							{isSelected && (
								<div className="absolute top-3.5 right-3.5 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
									<Check size={12} strokeWidth={3} />
								</div>
							)}

							{/* Icon & Title */}
							<div className="space-y-4">
								<div className={cn("size-10 rounded-lg flex items-center justify-center border", item.id === "dark" ? "bg-zinc-900 border-zinc-700 text-zinc-100" : "bg-zinc-100 border-zinc-200 text-zinc-900")}>
									<Icon size={20} />
								</div>
								<div className="space-y-2">
									<h2 className="text-sm font-semibold text-foreground">{item.label}</h2>
									<p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
								</div>
							</div>

							{/* Mini Interface Preview */}
							<div className={cn("mt-6 p-3 rounded-xl border text-[11px] space-y-2", item.id === "dark" ? "bg-zinc-950 border-zinc-800 text-zinc-200" : "bg-zinc-50 border-zinc-200 text-zinc-800")}>
								<div className="flex items-center justify-between">
									<span className="font-semibold text-xs">Task Board</span>
									<span className={cn("px-2 py-0.5 rounded-md text-[10px] font-medium", item.id === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-zinc-200 text-zinc-700")}>Active</span>
								</div>
								<div className={cn("h-2 rounded-full w-3/4", item.id === "dark" ? "bg-zinc-800" : "bg-zinc-200")} />
								<div className={cn("h-2 rounded-full w-1/2", item.id === "dark" ? "bg-zinc-800" : "bg-zinc-200")} />
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
