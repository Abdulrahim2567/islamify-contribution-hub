
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";

export default function ContributionsPage(props: any) {
  const { user, onLogout, users, onNewUser } = props;
  if (!user) return null;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar current="contributions" />
        <main className="flex flex-1 flex-col">
          {user.role === "admin"
            ? <AdminDashboard user={user} users={users} onLogout={onLogout} onNewUser={onNewUser} />
            : <MemberDashboard user={user} onLogout={onLogout} />
          }
        </main>
      </div>
    </SidebarProvider>
  );
}
