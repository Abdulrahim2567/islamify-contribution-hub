
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardPage(props: any) {
  const location = useLocation();
  const { user, onLogout, users, onNewUser } = props;
  if (!user) return null;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar current="dashboard" />
        <main className="flex flex-1 flex-col">
          {user.role === "admin"
            ? <AdminDashboard user={user} users={users} onLogout={onLogout} onNewUser={onNewUser} tab="dashboard"/>
            : <MemberDashboard user={user} onLogout={onLogout} tab="dashboard"/>
          }
        </main>
      </div>
    </SidebarProvider>
  );
}
