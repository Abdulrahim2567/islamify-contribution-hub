
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DashboardPage from "@/pages/Dashboard";
import MembersPage from "@/pages/Members";
import ContributionsPage from "@/pages/Contributions";
import SettingsPage from "@/pages/Settings";
import { useState, useEffect } from "react";

// Global state hack: Share user/login info with all pages
export default function App() {
  const queryClient = new QueryClient();
  // Move login and user logic here so we can pass to subpages
  const [users, setUsers] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Sync from Index page localstorage logic if needed
    const USERS_LOCALSTORAGE_KEY = "islamify_users";
    const DEMO_ADMIN = { id: 1, email: "admin@islamify.org", password: "admin123", role: "admin", name: "Admin User" };
    function getPersistedUsers() {
      try {
        const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
        const parsed = fromStorage ? JSON.parse(fromStorage) : [];
        const hasAdmin = parsed.some(u => u.email === DEMO_ADMIN.email);
        return hasAdmin ? parsed : [DEMO_ADMIN, ...parsed];
      } catch {
        return [DEMO_ADMIN];
      }
    }
    setUsers(getPersistedUsers());
  }, []);

  // Utility to update users state
  const updateUsers = (newUsers: any[]) => {
    const USERS_LOCALSTORAGE_KEY = "islamify_users";
    const DEMO_ADMIN = { id: 1, email: "admin@islamify.org", password: "admin123", role: "admin", name: "Admin User" };
    const withAdmin = newUsers.some(u => u.email === DEMO_ADMIN.email)
      ? newUsers
      : [DEMO_ADMIN, ...newUsers];
    localStorage.setItem(USERS_LOCALSTORAGE_KEY, JSON.stringify(withAdmin));
    // Immediately sync back
    setUsers(() => {
      try {
        const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
        return fromStorage ? JSON.parse(fromStorage) : [DEMO_ADMIN];
      } catch {
        return [DEMO_ADMIN];
      }
    });
  };

  // Prop passing for login/logout
  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };
  const login = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Index
                users={users}
                setUsers={setUsers}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                onLogin={login}
                onLogout={logout}
                updateUsers={updateUsers}
              />
            } />
            <Route path="/dashboard" element={
              isLoggedIn && currentUser ?
                  <DashboardPage
                    user={currentUser}
                    users={users}
                    onLogout={logout}
                    onNewUser={updateUsers}
                  /> : <Index
                    users={users}
                    setUsers={setUsers}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onLogin={login}
                    onLogout={logout}
                    updateUsers={updateUsers}
                  />
            } />
            <Route path="/members" element={
              isLoggedIn && currentUser ?
                  <MembersPage
                    user={currentUser}
                    users={users}
                    onLogout={logout}
                    onNewUser={updateUsers}
                  /> : <Index
                    users={users}
                    setUsers={setUsers}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onLogin={login}
                    onLogout={logout}
                    updateUsers={updateUsers}
                  />
            } />
            <Route path="/contributions" element={
              isLoggedIn && currentUser ?
                  <ContributionsPage
                    user={currentUser}
                    users={users}
                    onLogout={logout}
                    onNewUser={updateUsers}
                  /> : <Index
                    users={users}
                    setUsers={setUsers}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onLogin={login}
                    onLogout={logout}
                    updateUsers={updateUsers}
                  />
            } />
            <Route path="/settings" element={
              isLoggedIn && currentUser ?
                  <SettingsPage
                    user={currentUser}
                    users={users}
                    onLogout={logout}
                    onNewUser={updateUsers}
                  /> : <Index
                    users={users}
                    setUsers={setUsers}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    onLogin={login}
                    onLogout={logout}
                    updateUsers={updateUsers}
                  />
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
