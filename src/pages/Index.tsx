
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import LoginForm from "@/components/auth/LoginForm";

// Mock data - In real app, this would come from Supabase
const MOCK_USERS = [
  { id: 1, email: "admin@islamify.org", password: "admin123", role: "admin", name: "Admin User" },
  { id: 2, email: "member@islamify.org", password: "member123", role: "member", name: "John Doe", needsPasswordChange: false }
];

const USERS_LOCALSTORAGE_KEY = 'islamify_users';

function getPersistedUsers() {
  try {
    const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
    if (fromStorage) {
      return JSON.parse(fromStorage) || [];
    }
  } catch {}
  return [];
}

function persistUsers(users: any[]) {
  localStorage.setItem(USERS_LOCALSTORAGE_KEY, JSON.stringify(users));
}

const Index = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const { toast } = useToast();

  // On mount/load: merge users from localStorage with MOCK_USERS, avoid duplicate IDs/emails.
  useEffect(() => {
    const localUsers = getPersistedUsers();
    const mergedUsers = [
      ...MOCK_USERS.filter(m => !localUsers.some(u => u.email === m.email)),
      ...localUsers,
    ];
    setUsers(mergedUsers);
  }, []);

  // Helper: write users to both state and localStorage
  const updateUsers = (newUsers: any[]) => {
    persistUsers(newUsers.filter(u => !MOCK_USERS.some(m => m.email === u.email) || u.id > MOCK_USERS.length));
    // Always re-fetch from persisted store (authoritative) to update current roles/status
    const latestUsers = getPersistedUsers();
    const mergedUsers = [
      ...MOCK_USERS.filter(m => !latestUsers.some(u => u.email === m.email)),
      ...latestUsers,
    ];
    setUsers(mergedUsers);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowPasswordChange(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const requirePasswordChange = (user: any) => {
    setCurrentUser(user);
    setShowPasswordChange(true);
  };

  if (showPasswordChange && currentUser) {
    return (
      <ChangePasswordForm
        user={currentUser}
        users={users}
        setUsers={(u) => {
          updateUsers(u);
        }}
        onSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
          setIsLoggedIn(true);
          setShowPasswordChange(false);
        }}
        onCancel={() => {
          setShowPasswordChange(false);
          setIsLoggedIn(false);
        }}
      />
    );
  }

  if (isLoggedIn && currentUser) {
    return currentUser.role === 'admin' ? (
      <AdminDashboard user={currentUser} onLogout={handleLogout} onNewUser={updateUsers} users={users} />
    ) : (
      <MemberDashboard user={currentUser} onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-green-700 bg-clip-text text-transparent">
              Islamify
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Association Management System</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Manage Your Association
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track contributions, manage members, and facilitate loans with our comprehensive management system
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Member Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Comprehensive member registration, profile management, and role-based access control
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Contribution Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Track individual and total contributions with detailed reporting and analytics
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <LogIn className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Loan Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Enable loan applications based on contribution history with flexible terms
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Form */}
        <LoginForm
          users={users}
          onLogin={handleLogin}
          onRequirePasswordChange={requirePasswordChange}
          toast={toast}
        />
      </div>
    </div>
  );
};

export default Index;

