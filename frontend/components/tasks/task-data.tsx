export type Task = {
  id: string;
  title: string;
  assignee: {
    name: string;
    avatarUrl?: string;
  };
  dueDate: string;
  labels: string[];
};

export type TaskCol = {
  id: string;
  title: string;
  tasks: Task[];
};

export const taskCols : TaskCol[] = [
	{
		id: "todo",
		title: "To Do",
		tasks: [
			{
				id: "t1",
				title: "Write API Documentation" ,
				assignee: {
					name: "Admin",
					avatarUrl: "https://ui.shadcn.com/avatars/shadcn.jpg"
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t2",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t3",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t4",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t5",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t6",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			},
			{
				id: "t7",
				title: "Write API Documentation dfcdsghjgjk dfcdsghjgjk" ,
				assignee: {
					name: "Bhaumik",
				},
				dueDate: "29 jul",
				labels: ["deployment", "api", "documentaion", "REST API"]
			}
		]
	}, 
	{
		id: "doing",
		title: "Doing",
		tasks: []
	}, 
	{
		id: "completed",
		title: "Completed",
		tasks: []
	}, 
	{
		id: "on-hold",
		title: "On Hold",
		tasks: []
	}, 
	{
		id: "on-hol",
		title: "On Hold",
		tasks: []
	}, 
]