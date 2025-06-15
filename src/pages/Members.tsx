
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Users } from "lucide-react";
import MembersPage from "@/components/member/MembersPage";

export default function MembersPageRoute(props: any) {
  const { user, onLogout, users, onNewUser } = props;
  if (!user) return null;

  // For members, show the members directory
  if (user.role !== "admin") {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar current="members" />
          <main className="flex flex-1 flex-col">
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-800">Members Directory</h1>
                        <p className="text-gray-600">Browse association members</p>
                      </div>
                    </div>
                    <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </div>
              
              <MembersPage currentUser={user} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // For admin, show admin member management
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar current="members" />
        <main className="flex flex-1 flex-col">
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Member Management</h1>
                      <p className="text-gray-600">Manage association members</p>
                    </div>
                  </div>
                  <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* This will be populated with admin member management content */}
            <div className="container mx-auto px-4 py-8">
              <p className="text-gray-600">Admin member management functionality will be implemented here.</p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
