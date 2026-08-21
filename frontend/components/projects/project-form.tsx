"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import { useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MemberSelect } from "../tasks/member-select";
import { PrioritySelect } from "../tasks/priority-select";
import { useProjects } from "@/hooks/use-projects";
import type { CreateProjectInput } from "@/contexts/projects-context";
import { Badge } from "../ui/badge";

const projectFormSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		description: z.string().optional(),
		priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW", "NONE"]),
		leadId: z.string().nullable().optional(),
		startDate: z.string().optional().nullable(),
		dueDate: z.string().optional().nullable(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.dueDate) {
				return new Date(data.startDate) <= new Date(data.dueDate);
			}
			return true;
		},
		{
			message: "Due date cannot be earlier than start date",
			path: ["dueDate"],
		}
	);

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
	onSuccess?: () => void;
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
	const { members, createProject } = useProjects();
	const [startDateOpen, setStartDateOpen] = useState(false);
	const [dueDateOpen, setDueDateOpen] = useState(false);

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<ProjectFormValues>({
		resolver: zodResolver(projectFormSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "NONE",
			leadId: null,
			startDate: "",
			dueDate: "",
		},
	});

	const startDateValue = watch("startDate");
	const dueDateValue = watch("dueDate");

	const onSubmit = async (data: ProjectFormValues) => {
		const payload: CreateProjectInput = {
			title: data.title,
			description: data.description || undefined,
			priority: data.priority,
			leadId: data.leadId || null,
			startDate: data.startDate || null,
			dueDate: data.dueDate || null,
		};

		await createProject(payload);
		onSuccess?.();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
			{/* Title */}
			<div className="space-y-1.5">
				<Label htmlFor="title" className="text-xs font-medium">
					Project Name <span className="text-destructive">*</span>
				</Label>
				<Input
					id="title"
					placeholder="e.g. Mobile App Redesign"
					className="text-xs h-9"
					{...register("title")}
				/>
				{errors.title && (
					<p className="text-[11px] text-destructive">{errors.title.message}</p>
				)}
			</div>

			{/* Description */}
			<div className="space-y-1.5">
				<Label htmlFor="description" className="text-xs font-medium">
					Description
				</Label>
				<Textarea
					id="description"
					placeholder="Brief project goals or scope..."
					className="text-xs min-h-[70px] resize-none"
					{...register("description")}
				/>
			</div>

			{/* Priority & Lead Row */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label className="text-xs font-medium">Priority</Label>
					<Controller
						name="priority"
						control={control}
						render={({ field }) => (
							<PrioritySelect
								priority={field.value}
								onSelect={(val) => field.onChange(val)}
							/>
						)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="text-xs font-medium">Project Lead</Label>
					<Controller
						name="leadId"
						control={control}
						render={({ field }) => (
							<MemberSelect
								members={members}
								selectedMemberId={field.value}
								onSelect={(memberId) => field.onChange(memberId)}
							/>
						)}
					/>
				</div>
			</div>

			{/* Dates Row */}
			<div className="space-y-1.5">
				<Label className="text-xs font-medium">Project Timeline</Label>
				<div className="flex items-center gap-2">
					{/* Start Date */}
					<Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
						<PopoverTrigger
							nativeButton={false}
							render={
								<Badge
									variant="outline"
									className="cursor-pointer gap-1 px-2.5 py-1 font-normal text-xs hover:bg-accent"
								>
									<CalendarIcon className="size-3 text-muted-foreground" />
									<span className="text-muted-foreground">Start:</span>
									<span className="font-medium">
										{startDateValue
											? format(parseISO(startDateValue), "dd MMM yyyy")
											: "Set date"}
									</span>
								</Badge>
							}
						/>
						<PopoverContent className="w-auto p-3" align="start">
							<Calendar
								mode="single"
								selected={startDateValue ? parseISO(startDateValue) : undefined}
								onSelect={(date) => {
									setValue("startDate", date ? date.toISOString().split("T")[0] : "", {
										shouldValidate: true,
									});
									setStartDateOpen(false);
								}}
								disabled={(date) => {
									if (dueDateValue) {
										return date > parseISO(dueDateValue);
									}
									return false;
								}}
							/>
						</PopoverContent>
					</Popover>

					<ArrowRight className="size-3.5 text-muted-foreground shrink-0" />

					{/* Due Date */}
					<Popover open={dueDateOpen} onOpenChange={setDueDateOpen}>
						<PopoverTrigger
							nativeButton={false}
							render={
								<Badge
									variant="outline"
									className="cursor-pointer gap-1 px-2.5 py-1 font-normal text-xs hover:bg-accent"
								>
									<CalendarIcon className="size-3 text-muted-foreground" />
									<span className="text-muted-foreground">End:</span>
									<span className="font-medium">
										{dueDateValue
											? format(parseISO(dueDateValue), "dd MMM yyyy")
											: "Set date"}
									</span>
								</Badge>
							}
						/>
						<PopoverContent className="w-auto p-3" align="start">
							<Calendar
								mode="single"
								selected={dueDateValue ? parseISO(dueDateValue) : undefined}
								onSelect={(date) => {
									setValue("dueDate", date ? date.toISOString().split("T")[0] : "", {
										shouldValidate: true,
									});
									setDueDateOpen(false);
								}}
								disabled={(date) => {
									if (startDateValue) {
										return date < parseISO(startDateValue);
									}
									return false;
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
				{errors.dueDate && (
					<p className="text-[11px] text-destructive">{errors.dueDate.message}</p>
				)}
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="submit" size="sm" disabled={isSubmitting} className="rounded text-xs">
					{isSubmitting ? (
						<>
							<Loader2 className="size-3.5 animate-spin mr-1" />
							Creating...
						</>
					) : (
						"Create Project"
					)}
				</Button>
			</div>
		</form>
	);
}
