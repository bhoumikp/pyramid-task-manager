"use client";

import { Accent, useAccent } from "@/components/providers/accent-provider";
import { Check, Plus, FolderPlus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const accentOptions: { id: Accent; label: string; bgClass: string }[] = [
	{ id: "amber", label: "Amber", bgClass: "bg-amber-500" },
	{ id: "blue", label: "Blue", bgClass: "bg-blue-600" },
	{ id: "pink", label: "Pink", bgClass: "bg-pink-500" },
	{ id: "rose", label: "Rose", bgClass: "bg-rose-500" },
	{ id: "emerald", label: "Emerald", bgClass: "bg-emerald-500" },
	{ id: "black", label: "Black", bgClass: "bg-zinc-900 dark:bg-zinc-100" },
];

export default function ColorSettingsPage() {
	const { accent, setAccent } = useAccent();
	const activeOption = accentOptions.find((a) => a.id === accent) || accentOptions[5];

	return (
		<div className="max-w-2xl mx-auto space-y-8 py-4">
			{/* Page Header */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">Color</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Choose a custom accent color for buttons, active indicators, and interactive components.
				</p>
			</div>

			{/* Section 1: Color Selection Swatches */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
					Accent Palette
				</h2>

				<div className="bg-card grid grid-cols-2 sm:grid-cols-3 gap-3">
					{accentOptions.map((item) => {
						const isSelected = accent === item.id;

						return (
							<button
								key={item.id}
								type="button"
								onClick={() => setAccent(item.id)}
								className={cn(
									"flex items-center justify-between p-3 rounded-md border transition-all cursor-pointer text-left",
									isSelected
										? "border-primary bg-primary/5 ring-1 ring-primary/30"
										: "border-border/60 hover:border-border hover:bg-muted/40"
								)}
							>
								<div className="flex items-center gap-3">
									<div className={cn("size-5 rounded-full shrink-0 shadow-xs", item.bgClass)} />
									<span className="text-xs font-medium text-foreground">
										{item.id === "black" ? (
											<>
												<span className="dark:hidden">Black</span>
												<span className="hidden dark:inline">White</span>
											</>
										) : (
											item.label
										)}
									</span>
								</div>

								{isSelected && (
									<div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
										<Check size={10} strokeWidth={3} />
									</div>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Section 2: Explanatory Live UI Preview Card */}
			<div className="space-y-3">
				<h2 className="text-xs font-semibold text-foreground uppercase tracking-wider text-muted-foreground">
					Component Preview
				</h2>

				<div className="border border-border/80 rounded-lg bg-card p-6 space-y-6">
					<div className="flex items-center justify-between pb-4 border-b border-border/60">
						<div>
							<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
								<span>Active Theme Accent:</span>
								<span className="capitalize text-primary font-bold">
									{accent === "black" ? (
										<>
											<span className="dark:hidden">Black</span>
											<span className="hidden dark:inline">White</span>
										</>
									) : (
										activeOption.label
									)}
								</span>
							</h3>
							<p className="text-sm text-muted-foreground mt-0.5">
								Preview how your selected accent color applies across Pyramid Task Manager UI elements.
							</p>
						</div>
					</div>

					{/* Component Demos Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Demo 1: Primary Action Buttons */}
						<div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
							<span className="text-xs font-medium text-muted-foreground block">Action & Dialog Trigger</span>
							<div className="flex flex-wrap items-center gap-2">
								<Button className="h-8 text-xs font-medium rounded-lg cursor-pointer px-3">
									<Plus size={14} />
									New Task
								</Button>
								<Button variant="outline" className="h-8 text-xs font-medium rounded-lg cursor-pointer px-3">
									<FolderPlus size={14} />
									Add Project
								</Button>
							</div>
						</div>

						{/* Demo 2: Sidebar Accent Swatch & Active Nav */}
						<div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
							<span className="text-xs font-medium text-muted-foreground block">Sidebar & Navigation Swatch</span>
							<div className="flex items-center justify-between p-2 rounded-lg bg-accent text-accent-foreground font-medium text-xs border border-border/40">
								<div className="flex items-center gap-2">
									<div className="size-3.5 bg-primary rounded-xs shrink-0" data-accent={accent} />
									<span className="font-semibold">Color Settings</span>
								</div>
								<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
									Active
								</span>
							</div>
						</div>

						{/* Demo 3: Interactive Task Checkbox */}
						<div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
							<span className="text-xs font-medium text-muted-foreground block">Task Completion Checkbox</span>
							<div className="flex items-center gap-2.5 p-2 rounded-lg border border-primary/30 bg-primary/5 text-xs">
								<div className="size-4 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
									<Check size={11} strokeWidth={3} />
								</div>
								<span className="text-xs font-medium text-foreground line-through text-muted-foreground">
									Set up Google OAuth authentication
								</span>
							</div>
						</div>

						{/* Demo 4: Status & Priority Badges */}
						<div className="p-4 rounded-lg border border-border/50 bg-muted/20 space-y-3">
							<span className="text-xs font-medium text-muted-foreground block">Status & Priority Badges</span>
							<div className="flex flex-wrap items-center gap-2">
								<span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground">
									In Progress
								</span>
								<span className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-primary/30 text-primary bg-primary/10 flex items-center gap-1">
									<Tag size={10} />
									Urgent
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
