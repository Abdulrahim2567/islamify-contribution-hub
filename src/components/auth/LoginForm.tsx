
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock } from "lucide-react";
import { Member } from "@/types/types";
import { readMembersFromStorage } from "@/utils/membersStorage";

interface LoginFormProps {
  users: Member[];
  onLogin: (user: Member) => void;
  onRequirePasswordChange: (user: Member) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toast: any;
}

const LoginForm = ({
  users,
  onLogin,
  onRequirePasswordChange,
  toast,
}: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const  members = readMembersFromStorage();
    const user = members.find(
      (u) => u.email === loginForm.email && u.password === loginForm.password
    );
    

    if (user) {
      if (user.needsPasswordChange) {
        onRequirePasswordChange(user);
        toast({
          title: "Password Change Required",
          description: "Please change your default password to continue.",
        });
      } else {
        onLogin(user);
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

  return (
    <div className="flex items-center justify-center min-h-[440px] px-2">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center pb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
            Sign In
          </CardTitle>
          <CardDescription>
            Access your Islamify account
          </CardDescription>
        </CardHeader>
        {/* Info banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mx-6 mb-5 mt-2 text-center">
          <p className="text-sm text-emerald-800">
            Sign in as an admin or member to get started.<br />
            <span className="text-xs text-emerald-600">
              Use your email and password. Default users are provided below for demo.
            </span>
          </p>
        </div>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6 mt-2">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center input-icon text-emerald-500">
                  <Mail className="w-5 h-5" />
                </span>
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center input-icon text-blue-500">
                  <Lock className="w-5 h-5" />
                </span>
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-gray-600 rounded-lg border border-dashed border-blue-100 bg-blue-50 p-3">
            <p className="font-semibold mb-1">Demo credentials:</p>
            <p>
              <span className="font-medium text-blue-700">Admin:</span>&nbsp;
              admin@islamify.org / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
