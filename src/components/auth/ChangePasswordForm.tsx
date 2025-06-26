import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";
import { Member } from "@/types/types";

interface ChangePasswordFormProps {
	member: Member;
	updateMember: (id:number, member: Member) => void;
	onSuccess: (updatedMember: Member) => void;
	onCancel: () => void;
}

const ChangePasswordForm = ({
	member,
	updateMember,
	onSuccess,
	onCancel,
}: ChangePasswordFormProps) => {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { toast } = useToast();

	const passwordMismatch =
		newPassword !== confirmPassword && confirmPassword.length > 0;
	const passwordTooShort = newPassword.length > 0 && newPassword.length < 6;
	const canUpdate =
		newPassword.length >= 6 && newPassword === confirmPassword;

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

		const updatedMember = {
			...member,
			password: newPassword,
			needsPasswordChange: false,
		};
		updateMember(updatedMember.id, updatedMember);

		toast({
			title: "Password Updated",
			description: "Your password has been changed successfully",
		});
		setNewPassword("");
		setConfirmPassword("");
		onSuccess(updatedMember);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
			<Card className="w-full max-w-md shadow-lg animate-fade-in">
				<CardHeader className="text-center pb-2">
					<div className="flex flex-col items-center mb-3">
						<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
							<ShieldCheck className="w-8 h-8 text-white" />
						</div>
						<CardTitle className="text-2xl font-bold text-gray-900 mb-1">
							Set New Password
						</CardTitle>
						<CardDescription>
							Choose a strong new password to finish account setup
						</CardDescription>
					</div>
				</CardHeader>
				<div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mx-6 mb-5 mt-2">
					<p className="text-sm text-emerald-800">
						<strong>Password requirements:</strong> Minimum 6
						characters.
						<br />
						<span className="text-xs text-emerald-600">
							Make sure your password is difficult to guess and
							unique to this platform.
						</span>
					</p>
				</div>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6 mt-2">
						<div>
							<Label
								className="block text-sm font-medium text-gray-700 mb-2"
								htmlFor="newPassword"
							>
								New Password
							</Label>
							<Input
								id="newPassword"
								type="password"
								className="pl-3"
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e.target.value);
									setPasswordError("");
								}}
								placeholder="Enter new password"
								required
								minLength={6}
								autoFocus
							/>
						</div>
						<div>
							<Label
								className="block text-sm font-medium text-gray-700 mb-2"
								htmlFor="confirmPassword"
							>
								Confirm Password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								className="pl-3"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setPasswordError("");
								}}
								placeholder="Re-enter new password"
								required
								minLength={6}
							/>
						</div>
						{(passwordError ||
							passwordMismatch ||
							passwordTooShort) && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-6 mb-5 mt-2 w-full ml-0">
								<p className="text-sm text-red-800 text-center">
									{passwordError ||
										(passwordMismatch && (
											<span className="text-xs text-red-600">
												Passwords do not match
											</span>
										)) ||
										(passwordTooShort && (
											<span className="text-xs text-red-600">
												Password must be at least 6
												characters long
											</span>
										))}
								</p>
							</div>
						)}
						<div className="flex space-x-4">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={onCancel}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white transition-colors"
								disabled={!canUpdate}
							>
								Update Password
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ChangePasswordForm;
