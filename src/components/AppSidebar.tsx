
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
import { useSidebar } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";

interface AppSidebarProps {
  current: "dashboard" | "members" | "contributions" | "settings";
  onMenuClick?: (menu: string) => void;
}

export function AppSidebar({ current, onMenuClick }: AppSidebarProps) {
  const navigate = useNavigate();
  // Don't rely on route for highlight, use current prop
  
  // Menu items definition
  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
      onClick: () => onMenuClick ? onMenuClick("dashboard") : navigate("/dashboard"),
    },
    {
      key: "members",
      label: "Members",
      icon: Users,
      onClick: () => onMenuClick ? onMenuClick("members") : navigate("/members"),
    },
    {
      key: "contributions",
      label: "Manage Contributions",
      icon: Coins,
      onClick: () => onMenuClick ? onMenuClick("contributions") : navigate("/contributions"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => onMenuClick ? onMenuClick("settings") : navigate("/settings"),
    },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
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
                      onClick={item.onClick}
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
