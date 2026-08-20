import type { Task, UserSummary } from "./tasks";

export type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

export type Project = {
	id: string;
	title: string;
	description?: string;
	status: ProjectStatus;
	priority: Task["priority"];
	lead?: UserSummary | null;
	startDate?: string | null;
	dueDate?: string | null;
	createdAt: string;
};

export type ProjectField = "priority" | "lead" | "dueDate";
export type ProjectFieldState = Record<ProjectField, boolean>;

export const projectFieldLabels: Record<ProjectField, string> = {
	priority: "Priority",
	lead: "Lead",
	dueDate: "Due Date",
};

export const defaultProjectFields: ProjectFieldState = {
	priority: true,
	lead: true,
	dueDate: true,
};

export const initialProjects: Project[] = [
	{
		id: "proj-1",
		title: "Mobile App Redesign",
		description: "Revamp the mobile UX and upgrade to React Native 0.74",
		status: "IN_PROGRESS",
		priority: "HIGH",
		lead: {
			id: "usr-1",
			name: "Bhaumik Patel",
			avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
		},
		startDate: "2026-08-01",
		dueDate: "2026-09-15",
		createdAt: new Date().toISOString(),
	},
	{
		id: "proj-2",
		title: "Payment Gateway Integration",
		description: "Add Stripe and PayPal checkout flows with subscription billing",
		status: "PLANNING",
		priority: "URGENT",
		lead: {
			id: "usr-2",
			name: "Sarah Jenkins",
			avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
		},
		startDate: "2026-08-10",
		dueDate: "2026-08-30",
		createdAt: new Date().toISOString(),
	},
	{
		id: "proj-3",
		title: "Q3 Marketing Campaign",
		description: "Product launch social media assets and landing page optimization",
		status: "IN_PROGRESS",
		priority: "MEDIUM",
		lead: {
			id: "usr-3",
			name: "Alex Rivera",
			avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
		},
		startDate: "2026-07-15",
		dueDate: "2026-09-01",
		createdAt: new Date().toISOString(),
	},
	{
		id: "proj-4",
		title: "Infrastructure Migration",
		description: "Migrate database clusters to AWS Aurora PostgreSQL with multi-region backup",
		status: "ON_HOLD",
		priority: "LOW",
		lead: null,
		startDate: "2026-06-01",
		dueDate: "2026-10-30",
		createdAt: new Date().toISOString(),
	},
];
