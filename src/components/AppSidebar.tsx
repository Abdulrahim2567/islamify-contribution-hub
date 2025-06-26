
import { Calendar, Home, Users, Coins, Settings, LogOut, CreditCard, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Member } from "@/types/types";

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
  },
  {
    title: "Settings",
    value: "settings",
    icon: Settings,
  },
];

export function AppSidebar({ activeTab, onTabChange, onLogout, user }: AppSidebarProps) {
  return (
    <Sidebar className="fixed top-0 left-0 h-screen">
      <SidebarHeader className="border-b border-gray-200 p-7 overflow-visible">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-900">Islamify Management</h2>
        </div>
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
                      ${activeTab === item.value 
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 scale-105 animate-fade-in" 
                        : "hover:scale-102 hover:bg-gray-50"
                      }
                    `}
                  >
                    <button className="w-full">
                      <item.icon className={`transition-colors duration-200 ${
                        activeTab === item.value ? 'text-emerald-600' : ''
                      }`} />
                      <span className="transition-colors duration-200">{item.title}</span>
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
