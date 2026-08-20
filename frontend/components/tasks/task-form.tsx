"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { taskPriorityLabels } from "@/lib/tasks";
import { useTasks } from "@/hooks/use-tasks";
import { useState } from "react";

import { statusLabels } from "./details/task-details-constants";
import type { Task } from "@/lib/tasks";

const taskFormSchema = z
	.object({
		title: z.string().trim().min(1, "Title is required"),

		description: z.string().optional(),

		status: z.enum(["TODO", "DOING", "COMPLETED", "ON_HOLD"]).optional(),

		priority: z.enum([
			"NONE",
			"URGENT",
			"HIGH",
			"MEDIUM",
			"LOW",
		]),

		startDate: z.date().optional().nullable(),
		dueDate: z.date().optional().nullable(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.dueDate) {
				return data.dueDate >= data.startDate;
			}
			return true;
		},
		{
			message: "Due date cannot be before start date",
			path: ["dueDate"],
		}
	);

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TaskForm({
	initialStatus,
	onSuccess,
}: {
	initialStatus?: Task["status"];
	onSuccess: () => void;
}) {
	const [submitError, setSubmitError] = useState<string | null>(null);
	const { createNewTask } = useTasks();
	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),

		defaultValues: {
			title: "",
			description: "",
			status: initialStatus || "TODO",
			priority: "NONE",
			startDate: null,
			dueDate: null,
		},
	});

	async function onSubmit(values: TaskFormValues) {
		setSubmitError(null);

		const payload = {
			title: values.title,
			description: values.description || undefined,
			status: values.status,
			priority: values.priority,
			startDate: values.startDate
				? format(values.startDate, "yyyy-MM-dd")
				: undefined,
			dueDate: values.dueDate
				? format(values.dueDate, "yyyy-MM-dd")
				: undefined,
		};

		try {
			await createNewTask(payload);

			form.reset();
			onSuccess();
		} catch (error) {
			console.error(error);
			setSubmitError("Failed to create task. Please try again.");
		}
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup className="gap-5">
				{/* Title */}
				<Controller
					name="title"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name} className="gap-1">
								Title
								<span className="text-destructive">*</span>
							</FieldLabel>

							<Input
								{...field}
								id={field.name}
								placeholder="Enter task title"
								aria-invalid={fieldState.invalid}
							/>

							<FieldError errors={[fieldState.error]} />
						</Field>
					)}
				/>

				{/* Description */}
				<Controller
					name="description"
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor={field.name}>
								Description
							</FieldLabel>

							<Textarea
								{...field}
								id={field.name}
								placeholder="Add a description"
								aria-invalid={fieldState.invalid}
							/>

							<FieldError errors={[fieldState.error]} />
						</Field>
					)}
				/>

				{/* Status & Priority Row */}
				<div className="grid grid-cols-2 gap-4">
					{/* Status */}
					<Controller
						name="status"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>
									Status
								</FieldLabel>

								<Select
									value={field.value || "TODO"}
									onValueChange={(value) => {
										if (value) {
											field.onChange(value);
										}
									}}
								>
									<SelectTrigger
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue>
											{field.value ? statusLabels[field.value] : "To Do"}
										</SelectValue>
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="TODO">To Do</SelectItem>
										<SelectItem value="DOING">Doing</SelectItem>
										<SelectItem value="COMPLETED">Completed</SelectItem>
										<SelectItem value="ON_HOLD">On Hold</SelectItem>
									</SelectContent>
								</Select>

								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>

					{/* Priority */}
					<Controller
						name="priority"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>
									Priority
								</FieldLabel>

								<Select
									value={field.value}
									onValueChange={(value) => {
										if (value) {
											field.onChange(value);
										}
									}}
								>
									<SelectTrigger
										className="w-full"
										aria-invalid={fieldState.invalid}
									>
										<SelectValue>
											{taskPriorityLabels[field.value]}
										</SelectValue>
									</SelectTrigger>

									<SelectContent>
										<SelectItem value="NONE">
											No Priority
										</SelectItem>

										<SelectItem value="URGENT">
											Urgent
										</SelectItem>

										<SelectItem value="HIGH">
											High
										</SelectItem>

										<SelectItem value="MEDIUM">
											Medium
										</SelectItem>

										<SelectItem value="LOW">
											Low
										</SelectItem>
									</SelectContent>
								</Select>

								<FieldError errors={[fieldState.error]} />
							</Field>
						)}
					/>
				</div>

				{/* Individual Start Date & Due Date Row */}
				<div className="grid grid-cols-2 gap-4">
					{/* Start Date */}
					<Controller
						name="startDate"
						control={form.control}
						render={({ field, fieldState }) => {
							const currentDueDate = form.watch("dueDate");
							return (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Start Date</FieldLabel>
									<Popover>
										<PopoverTrigger
											nativeButton={false}
											render={
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal px-2.5 text-sm cursor-pointer"
													aria-invalid={fieldState.invalid}
												>
													<CalendarIcon className="size-3.5 shrink-0" />
													{field.value ? (
														format(field.value, "dd MMM yyyy")
													) : (
														<span className="text-muted-foreground text-sm">Select start date</span>
													)}
												</Button>
											}
										/>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value ?? undefined}
												onSelect={field.onChange}
												disabled={(date) => (currentDueDate ? date > currentDueDate : false)}
											/>
										</PopoverContent>
									</Popover>
									<FieldError errors={[fieldState.error]} />
								</Field>
							);
						}}
					/>

					{/* Due Date */}
					<Controller
						name="dueDate"
						control={form.control}
						render={({ field, fieldState }) => {
							const currentStartDate = form.watch("startDate");
							return (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Due Date</FieldLabel>
									<Popover>
										<PopoverTrigger
											nativeButton={false}
											render={
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal px-2.5 text-xs cursor-pointer"
													aria-invalid={fieldState.invalid}
												>
													<CalendarIcon className="size-3.5 shrink-0" />
													{field.value ? (
														format(field.value, "dd MMM yyyy")
													) : (
														<span className="text-muted-foreground">Select due date</span>
													)}
												</Button>
											}
										/>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value ?? undefined}
												onSelect={field.onChange}
												disabled={(date) => (currentStartDate ? date < currentStartDate : false)}
											/>
										</PopoverContent>
									</Popover>
									<FieldError errors={[fieldState.error]} />
								</Field>
							);
						}}
					/>
				</div>

				{submitError && (
					<p className="text-sm text-destructive">
						{submitError}
					</p>
				)}

				{/* Submit */}
				<Button
					type="submit"
					size={"lg"}
					disabled={form.formState.isSubmitting}
				>
					{form.formState.isSubmitting
						? "Creating..."
						: "Create Task"}
				</Button>
			</FieldGroup>
		</form>
	);
}