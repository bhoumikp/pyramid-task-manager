"use client";

import {
  ChevronsUpDown,
  Moon,
  Settings,
  Sun,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatarUrl: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="rounded-full">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-md"
            side="bottom"
            align="center"
            sideOffset={4}
          >
            <DropdownMenuGroup>
				<div className="container flex flex-col items-center gap-4 p-4">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.avatarUrl} alt={user.name} />
						<AvatarFallback className="rounded-full">CN</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-xs font-medium text-center leading-4">
						<span className="truncate">{user.name}</span>
						<span className="truncate text-muted-foreground">{user.email}</span>
					</div>
				</div>
            	<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger className={"py-2 px-3 gap-2.5"}>
						<Sun />
						Change Theme
					</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent 
								className={"min-w-48"}
								sideOffset={20}
							>
								<DropdownMenuGroup>
									<DropdownMenuLabel className={"py-2.5 px-3"}>
										Theme
									</DropdownMenuLabel>
									<DropdownMenuRadioGroup>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="light"
										>
											<Sun />
											Light
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="dark"
										>
											<Moon />
											Dark
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
					<DropdownMenuSubTrigger className={"py-2 px-3 gap-2.5"}>
						<div className="size-4 bg-black rounded-xs"></div>
						Color Mode
					</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent 
								className={"min-w-48"}
								sideOffset={20}
							>
								<DropdownMenuGroup>
									<DropdownMenuLabel className={"py-2.5 px-3"}>
										Color Mode
									</DropdownMenuLabel>
									<DropdownMenuRadioGroup>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="amber"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="amber"></div>
											Amber
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="blue"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="blue"></div>
											Blue
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="pink"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="pink"></div>
											Pink
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="rose"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="rose"></div>
											Rose
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="emerald"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="emerald"></div>
											Emerald
										</DropdownMenuRadioItem>
										<DropdownMenuRadioItem 
											className={"py-2.5 px-3 gap-2.5"}
											value="black"
										>
											<div className="size-4 bg-primary rounded-xs" data-accent="black"></div>
											Black
										</DropdownMenuRadioItem>
									</DropdownMenuRadioGroup>
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>			  
					<Link href={"/settings"}>
						<DropdownMenuItem className={"py-2 pl-3 pr-8 gap-2.5"}>
								<Settings />
								Settings
						</DropdownMenuItem>
					</Link>
				</DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}