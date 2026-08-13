import {
	ChevronDown,
  	LucideIcon,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function SidebarNavMain({
  items,
}: {
  items: {
    title: string
	url: string
    icon?: LucideIcon,
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
		<Collapsible 
			className="group/collapsible"
			defaultOpen={true}	
		>
		<CollapsibleTrigger className={"w-full"}>
	  		<SidebarGroupLabel className="flex cursor-pointer justify-between text-sm text-sidebar-foreground px-3">
				Workspace
				<ChevronDown className="size-4 transition-transform duration-200 group-not-data-open/collapsible:-rotate-90" />
			</SidebarGroupLabel>
			
		</CollapsibleTrigger>
		<CollapsibleContent>
			<SidebarMenu>
				{items.map((item, index) => (
					<SidebarMenuItem key={index}>
						<SidebarMenuButton 
							render={<Link href={item.url} />}
							className="text-sidebar-accent-foreground"
						>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</CollapsibleContent>
	  </Collapsible>
    </SidebarGroup>
  )
}