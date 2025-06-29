import {
	Home,
	Users,
	Coins,
	Settings,
	CreditCard,
	ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarHeader,
} from "@/components/ui/sidebar";

import { Member } from "@/types/types";
import { useSidebar } from "@/components/ui/sidebar";

interface AppSidebarProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	onLogout: () => void;
	user: Member;
}

const navigationItems = [
	{
		title: "Dashboard",
		value: "dashboard",
		icon: Home,
	},
	{
		title: "Members",
		value: "members",
		icon: Users,
	},
	{
		title: "Contributions",
		value: "contributions",
		icon: Coins,
	},
	{
		title: "Loans",
		value: "loans",
		icon: CreditCard,
	}
];

export function AppSidebar({
	activeTab,
	onTabChange,
	onLogout,
	user,
}: AppSidebarProps) {
	const { toggleSidebar } = useSidebar();

	return (
		<Sidebar className="fixed top-0 left-0 h-screen text-foreground border-r border-border">
			<SidebarHeader className="border-b border-border p-[42px] overflow-visible">
				<button
					onClick={toggleSidebar}
					className="absolute mt-3 top-3 right-3 p-2 rounded-full h-fit w-fit transition text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/70"
				>
					<ArrowLeft size={18} />
				</button>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map((item) => (
								<SidebarMenuItem key={item.value}>
									<SidebarMenuButton
										asChild
										onClick={() => onTabChange(item.value)}
										className={`
                      transition-all duration-300 ease-in-out transform
                      ${
							activeTab === item.value
								? "bg-muted text-foreground hover:bg-muted/80 scale-105"
								: "hover:scale-102 hover:bg-muted/50"
						}
                    `}
									>
										<button className="w-full flex items-center gap-2">
											<item.icon
												className={`transition-colors duration-200 ${
													activeTab === item.value
														? "text-primary"
														: "text-muted-foreground"
												}`}
											/>
											<span className="transition-colors duration-200">
												{item.title}
											</span>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
