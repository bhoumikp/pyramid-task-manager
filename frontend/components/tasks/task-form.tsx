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

const taskFormSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),

	description: z.string().optional(),

	priority: z.enum([
		"NONE",
		"URGENT",
		"HIGH",
		"MEDIUM",
		"LOW",
	]),

	dateRange: z
		.object({
		from: z.date(),
		to: z.date().optional(),
		})
		.optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TaskForm({onSuccess} : { onSuccess: () => void }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { createNewTask } = useTasks();
  const form = useForm<TaskFormValues>({
	resolver: zodResolver(taskFormSchema),

	defaultValues: {
	  title: "",
	  description: "",
	  priority: "NONE",
	  dateRange: undefined,
	},
  });

 	async function onSubmit(values: TaskFormValues) {
		setSubmitError(null);

		const payload = {
			title: values.title,
			description: values.description || undefined,
			priority: values.priority,
			startDate: values.dateRange?.from
			? format(values.dateRange.from, "yyyy-MM-dd")
			: undefined,
			dueDate: values.dateRange?.to
			? format(values.dateRange.to, "yyyy-MM-dd")
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
	  <FieldGroup>
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

		{/* Start Date + Due Date */}
		<Controller
		  name="dateRange"
		  control={form.control}
		  render={({ field, fieldState }) => (
			<Field data-invalid={fieldState.invalid}>
			  <FieldLabel>
				Dates
			  </FieldLabel>

			  <Popover>
				<PopoverTrigger
				  render={
					<Button
					  variant="outline"
					  className="w-full justify-start text-left font-normal"
					  aria-invalid={fieldState.invalid}
					>
					  <CalendarIcon />

					  {field.value?.from ? (
						field.value.to ? (
						  <>
							{format(
							  field.value.from,
							  "dd MMM yyyy"
							)}{" "}
							–{" "}
							{format(
							  field.value.to,
							  "dd MMM yyyy"
							)}
						  </>
						) : (
						  format(
							field.value.from,
							"dd MMM yyyy"
						  )
						)
					  ) : (
						<span className="text-muted-foreground">
						  Select dates
						</span>
					  )}
					</Button>
				  }
				/>

				<PopoverContent
				  className="w-auto p-0"
				  align="start"
				>
				  <Calendar
					mode="range"
					selected={field.value}
					onSelect={field.onChange}
					numberOfMonths={2}
				  />
				</PopoverContent>
			  </Popover>

			  <FieldError errors={[fieldState.error]} />
			</Field>
		  )}
		/>

		{submitError && (
			<p className="text-sm text-destructive">
				{submitError}
			</p>
		)}

		{/* Submit */}
		<Button
		  type="submit"
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