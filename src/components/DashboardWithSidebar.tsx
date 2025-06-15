
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminDashboard from "./AdminDashboard";
import MemberDashboard from "./MemberDashboard";

export function AdminDashboardWithSidebar(props: any) {
  // Infer which "tab" is active based on props or context; adjust as needed
  const [tab, setTab] = useState<"dashboard"|"members"|"contributions"|"settings">("dashboard");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          current={tab}
          onMenuClick={(selected) => setTab(selected as any)}
        />
        <main className="flex flex-1 flex-col">
          <AdminDashboard {...props} tab={tab} setTab={setTab}/>
        </main>
      </div>
    </SidebarProvider>
  );
}

export function MemberDashboardWithSidebar(props: any) {
  const [tab, setTab] = useState<"dashboard"|"members"|"contributions"|"settings">("dashboard");
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          current={tab}
          onMenuClick={(selected) => setTab(selected as any)}
        />
        <main className="flex flex-1 flex-col">
          <MemberDashboard {...props} tab={tab} setTab={setTab}/>
        </main>
      </div>
    </SidebarProvider>
  );
}
