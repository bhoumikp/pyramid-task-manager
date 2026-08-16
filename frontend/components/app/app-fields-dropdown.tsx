import { Columns3, Grid2x2, TextAlignJustify} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { TaskView } from "../tasks/task-shell";

interface AppFieldsDropdownProps {
  fields: string[];
  view: TaskView;
  onViewChange: (view: TaskView) => void;
}

export function AppFieldsDropdown({ fields, view, onViewChange } : AppFieldsDropdownProps) {
	function isTaskView(value: string): value is TaskView {
		return value === "board" || value === "list";
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={
				<Button
					variant={"outline"} 
					size={"lg"}
					className={"rounded text-xs"}
				>
					<Columns3 /> 
					Fields
				</Button>
			}></DropdownMenuTrigger>

			<DropdownMenuContent 
				className={"w-(--radix-dropdown-menu-trigger-width) min-w-76 rounded-md p-4 shadow-md"}
				align="center"
			>
				<DropdownMenuGroup className={"flex flex-col gap-4"}>
					<ToggleGroup 
						value={[view]}
						variant={"outline"}
						size={"lg"}
						spacing={0}
						onValueChange={(value) => {
							const nextView = value[0];

							if (nextView && isTaskView(nextView)) {
								onViewChange(nextView);
							}
						}}
					>
						<ToggleGroupItem 
							className={"cursor-pointer rounded-l-md rounded-r-none w-34 px-3"}
							value="list" 
							aria-label="Toggle list"
						>
							<TextAlignJustify />
							List
						</ToggleGroupItem>
						<ToggleGroupItem 
							className={"cursor-pointer rounded-r-md rounded-l-none w-34 px-3"}
							value="board" 
							aria-label="Toggle board"
						>
							<Grid2x2 />
							Board
						</ToggleGroupItem>
					</ToggleGroup>

					<ul >
						{fields.map((field, index) => (
							<li key={index} className="flex justify-between items-center min-h-8">
								<Label className="text-xs" htmlFor={String(index)}>{field}</Label>
								<Checkbox id={String(index)} checked/>
							</li>
						))}
					</ul>

				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>		
	)
}