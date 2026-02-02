import { SidebarTrigger } from "@/components/ui/sidebar";

function AppHeader() {
	return (
		<header className="flex h-14 shrink-0 items-center px-4 border-b gap-2 bg-background">
			<SidebarTrigger />
		</header>
	);
}

export default AppHeader;
