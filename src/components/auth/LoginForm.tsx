
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";

interface LoginFormProps {
  users: any[];
  onLogin: (user: any) => void;
  onRequirePasswordChange: (user: any) => void;
  toast: any;
}

const LoginForm = ({ users, onLogin, onRequirePasswordChange, toast }: LoginFormProps) => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u =>
      u.email === loginForm.email && u.password === loginForm.password
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
  );
};

export default LoginForm;
