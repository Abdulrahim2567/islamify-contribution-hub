
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Home, Users, Coins, Settings, Menu } from "lucide-react";
import React from "react";

interface AppSidebarProps {
  current?: "dashboard" | "members" | "contributions" | "settings";
  onMenuClick?: (menu: string) => void;
}

export function AppSidebar({ current, onMenuClick }: AppSidebarProps) {
  // Remove route logic: we only use 'current' from props for tab selection
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      key: "members",
      label: "Members",
      icon: Users,
    },
    {
      key: "contributions",
      label: "Manage Contributions",
      icon: Coins,
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  function handleNav(key: string) {
    if (onMenuClick) onMenuClick(key);
    // NO URL navigation!
  }

  return (
    <>
      {/* Hamburger only for mobile */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger>
          <Menu size={28} />
        </SidebarTrigger>
      </div>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={current === item.key}
                      onClick={() => handleNav(item.key)}
                    >
                      <item.icon className="mr-2" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

