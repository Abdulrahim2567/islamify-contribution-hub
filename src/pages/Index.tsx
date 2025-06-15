
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Users, TrendingUp } from "lucide-react";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";

// Mock data - In real app, this would come from Supabase
const MOCK_USERS = [
  { id: 1, email: "admin@islamify.org", password: "admin123", role: "admin", name: "Admin User" },
  { id: 2, email: "member@islamify.org", password: "member123", role: "member", name: "John Doe", needsPasswordChange: false }
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => 
      u.email === loginForm.email && u.password === loginForm.password
    );

    if (user) {
      if (user.needsPasswordChange) {
        setCurrentUser(user);
        setShowPasswordChange(true);
        toast({
          title: "Password Change Required",
          description: "Please change your default password to continue.",
        });
      } else {
        setCurrentUser(user);
        setIsLoggedIn(true);
        toast({
          title: "Welcome to Islamify",
          description: `Logged in successfully as ${user.role}`,
        });
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Update user password
    const updatedUser = { ...currentUser, needsPasswordChange: false };
    setCurrentUser(updatedUser);
    setIsLoggedIn(true);
    setShowPasswordChange(false);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setLoginForm({ email: "", password: "" });
    setShowPasswordChange(false);
    setNewPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  if (showPasswordChange) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-800">Change Password</CardTitle>
            <CardDescription>Please set a new password to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoggedIn && currentUser) {
    return currentUser.role === 'admin' ? (
      <AdminDashboard user={currentUser} onLogout={handleLogout} />
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
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-800">Sign In</CardTitle>
              <CardDescription>Access your Islamify account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Demo credentials:</p>
                <p>Admin: admin@islamify.org / admin123</p>
                <p>Member: member@islamify.org / member123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
