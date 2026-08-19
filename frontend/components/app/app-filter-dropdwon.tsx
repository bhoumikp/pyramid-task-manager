import { Button } from "../ui/button";
import { Funnel, LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Task } from "@/lib/tasks";

interface Filters {
	label: string,
	icon: LucideIcon,
	items: {
		label: string,
		value: Task["priority"],
		icon: LucideIcon,
		color?: string
	}[]
}

interface AppFilter {
  filters: Filters[];
  priorityFilters: Task["priority"][];
  onPriorityFilterToggle: (priority: Task["priority"]) => void;
}

export function AppFilterDropdown({
	filters,
	priorityFilters,
	onPriorityFilterToggle,
} : AppFilter) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={
				<Button variant={"outline"}  className={"px-2 rounded text-xs"}><Funnel /></Button>
			}></DropdownMenuTrigger>

			<DropdownMenuContent 
				className={"w-(--radix-dropdown-menu-trigger-width) min-w-48 rounded-md shadow-lg"}
				align="center"
			>
				<DropdownMenuGroup className={"flex flex-col gap-4"}>
					<ul >
						{filters.map((filter, filterIndex) => (
							<DropdownMenuSub key={filterIndex}>
								<DropdownMenuSubTrigger className={"py-2 px-3 gap-2.5"}>
									<filter.icon />
									{filter.label}
								</DropdownMenuSubTrigger>
								<DropdownMenuPortal>
									<DropdownMenuSubContent 
										className={"min-w-48"}
										sideOffset={20}
									>
										<DropdownMenuGroup>
											<DropdownMenuLabel className={"py-2.5 px-3"}>
												{filter.label}
											</DropdownMenuLabel>
											{filter.items.map((item, itemIndex) => (
												<DropdownMenuCheckboxItem 
													key={itemIndex} 
													className={`py-2 pr-8 pl-3 gap-2.5 ${item.color ? "text-"+item.color: ""}`}
													checked={priorityFilters.includes(item.value)}
													onCheckedChange={() => onPriorityFilterToggle(item.value)}
												>
													<item.icon />
													{item.label}
												</DropdownMenuCheckboxItem>
											))}
										</DropdownMenuGroup>
									</DropdownMenuSubContent>
								</DropdownMenuPortal>
							</DropdownMenuSub>
						))}
					</ul>

				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>		
	)
}
