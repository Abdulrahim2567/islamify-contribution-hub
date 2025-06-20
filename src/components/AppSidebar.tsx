
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

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: any;
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
      <SidebarHeader className="border-b border-gray-200 p-4 overflow-visible">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-900">Islamify Management</h2>
          <div className="ml-auto relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg border border-gray-200 z-50">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuItem onClick={onLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
