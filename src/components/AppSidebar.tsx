
import { Calendar, Home, Users, Coins, Settings, LogOut, CreditCard } from "lucide-react";
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
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  user: any;
  hideUserProfile?: boolean;
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

export function AppSidebar({ activeTab, onTabChange, onLogout, user, hideUserProfile = false }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Islamify Management</SidebarGroupLabel>
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
      
      {!hideUserProfile && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <div className="flex items-center gap-2 p-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={onLogout}>
                <button className="w-full text-red-600 hover:bg-red-50">
                  <LogOut />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
