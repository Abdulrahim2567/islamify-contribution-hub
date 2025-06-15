
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import LoginForm from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";

// Default admin user: always present as fallback if localstorage empty
const DEMO_ADMIN = { id: 1, email: "admin@islamify.org", password: "admin123", role: "admin", name: "Admin User" };
const USERS_LOCALSTORAGE_KEY = "islamify_users";

function getPersistedUsers() {
  try {
    const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
    const parsed = fromStorage ? JSON.parse(fromStorage) : [];
    // Always include the demo admin if not in localStorage
    const hasAdmin = parsed.some(u => u.email === DEMO_ADMIN.email);
    return hasAdmin ? parsed : [DEMO_ADMIN, ...parsed];
  } catch {
    return [DEMO_ADMIN];
  }
}

function persistUsers(users: any[]) {
  // Always ensure the demo admin remains present in the users list
  const withAdmin = users.some(u => u.email === DEMO_ADMIN.email)
    ? users
    : [DEMO_ADMIN, ...users];
  localStorage.setItem(USERS_LOCALSTORAGE_KEY, JSON.stringify(withAdmin));
}

interface IndexProps {
  users: any[];
  setUsers: (users: any[]) => void;
  isLoggedIn: boolean;
  currentUser: any;
  onLogin: (user: any) => void;
  onLogout: () => void;
  updateUsers: (users: any[]) => void;
}

const Index = ({ users, setUsers, isLoggedIn, currentUser, onLogin, onLogout, updateUsers }: IndexProps) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, currentUser, navigate]);

  const handleLogin = (user: any) => {
    onLogin(user);
    navigate("/dashboard");
  };

  const requirePasswordChange = (user: any) => {
    setShowPasswordChange(true);
    // We'll handle the user in the password change form
  };

  if (showPasswordChange) {
    return (
      <ChangePasswordForm
        user={currentUser}
        users={users}
        setUsers={updateUsers}
        onSuccess={(updatedUser) => {
          onLogin(updatedUser);
          setShowPasswordChange(false);
          navigate("/dashboard");
        }}
        onCancel={() => {
          setShowPasswordChange(false);
          onLogout();
          navigate("/");
        }}
      />
    );
  }

  if (isLoggedIn && currentUser) {
    // This should redirect via useEffect, but just in case
    return null;
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
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Manage Your Association</h2>
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
