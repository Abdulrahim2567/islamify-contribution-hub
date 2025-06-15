
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordFormProps {
  user: any;
  users: any[];
  setUsers: (users: any[]) => void;
  onSuccess: (updatedUser: any) => void;
  onCancel: () => void;
}

const ChangePasswordForm = ({ user, users, setUsers, onSuccess, onCancel }: ChangePasswordFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { toast } = useToast();

  const passwordMismatch = newPassword !== confirmPassword && confirmPassword.length > 0;
  const passwordTooShort = newPassword.length > 0 && newPassword.length < 6;
  const canUpdate = newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure the passwords match.",
        variant: "destructive",
      });
      return;
    }

    const updatedUser = { ...user, password: newPassword, needsPasswordChange: false };
    const updatedUsers = users.map(u => u.email === updatedUser.email ? updatedUser : u);
    setUsers(updatedUsers);

    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully",
    });
    setNewPassword("");
    setConfirmPassword("");
    onSuccess(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-800">Change Password</CardTitle>
          <CardDescription>Please set a new password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter new password"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Re-enter new password"
                required
              />
            </div>
            {(passwordError || passwordMismatch || passwordTooShort) && (
              <div className="text-red-600 text-sm">
                {passwordError ||
                  (passwordMismatch && "Passwords do not match") ||
                  (passwordTooShort && "Password must be at least 6 characters long")}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 transition-colors"
              disabled={!canUpdate}
            >
              Update Password
            </Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm;
