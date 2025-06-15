
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
  current?: "dashboard" | "members" | "contributions" | "settings";
  onMenuClick?: (menu: string) => void;
}

export function AppSidebar({ current, onMenuClick }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Path-based keys to highlight current nav even on page reload
  const routeToKey: Record<string, "dashboard" | "members" | "contributions" | "settings"> = {
    "/dashboard": "dashboard",
    "/members": "members",
    "/contributions": "contributions",
    "/settings": "settings"
  };
  // Detect active tab: use props.current if set (for internal tab switch), else from URL
  const activeKey = current || routeToKey[location.pathname] || "dashboard";

  // Unified navigation and prop callback
  function handleNav(key: string, path: string) {
    if (onMenuClick) onMenuClick(key);
    navigate(path);
  }

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      key: "members",
      label: "Members",
      icon: Users,
      path: "/members",
    },
    {
      key: "contributions",
      label: "Manage Contributions",
      icon: Coins,
      path: "/contributions",
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

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
                      isActive={activeKey === item.key}
                      onClick={() => handleNav(item.key, item.path)}
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
