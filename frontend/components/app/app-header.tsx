import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export function AppHeader() {
	return(
		<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className={"border-0"}/>
		   	<Separator orientation="vertical" className={"h-4 data-vertical:self-center"} />
          </div>
        </header>
	)
}