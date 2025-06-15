
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
import { useNavigate, useLocation } from "react-router-dom";

interface AppSidebarProps {
  current?: "dashboard" | "members" | "contributions" | "settings";
}

export function AppSidebar({ current }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Define mapping for app pages
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

  // Determine active tab by URL (default dashboard)
  const activeKey = React.useMemo(() => {
    for (const i of menuItems) {
      if (location.pathname.startsWith(i.path)) return i.key;
    }
    return "dashboard";
  }, [location.pathname]);

  function handleNav(path: string, key: string) {
    if (location.pathname !== path) {
      navigate(path);
    }
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
                      isActive={activeKey === item.key}
                      onClick={() => handleNav(item.path, item.key)}
                      className={
                        activeKey === item.key
                          ? "bg-emerald-100 text-emerald-700"
                          : ""
                      }
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

