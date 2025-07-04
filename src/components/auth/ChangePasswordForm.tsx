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
import { Info, ShieldCheck, Lock, Check } from "lucide-react";
import { Member } from "@/types/types";
import { useMembers } from "@/hooks/useMembers";

interface ChangePasswordFormProps {
	member: Member;
	onSuccess: (updatedMember: Member) => void;
	onCancel: () => void;
	onLogout: () => void;
}

const ChangePasswordForm = ({
	member,
	onSuccess,
	onCancel,
	onLogout,
}: ChangePasswordFormProps) => {
	const { updateMember } = useMembers();
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const { toast } = useToast();

	const passwordMismatch =
		newPassword !== confirmPassword && confirmPassword.length > 0;
	const passwordTooShort = newPassword.length > 0 && newPassword.length < 6;
	const canUpdate =
		newPassword.length >= 6 && newPassword === confirmPassword;

	const passwordsMatch =
		newPassword === confirmPassword && confirmPassword.length > 1;

	const handleSubmit = async (e: React.FormEvent) => {
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

		setIsLoading(true);

		const updateStatus = await updateMember(member._id, updatedMember);

		if (updateStatus === "success") {
			setIsLoading(false);
			toast({
				title: "Password Updated",
				description: "Your password has been changed successfully.",
				variant: "default",
			});
			onSuccess(updatedMember);
		} else if (updateStatus === "deleted") {
			setIsLoading(false);
			toast({
				title: "Session Expired",
				description:
					"Session Expired. You will be redirected.",
				variant: "destructive",
			});

			// Clear any user state and redirect
			// onLogout();
			// onCancel(); // optionally close the form
		} else {
			setIsLoading(false);
			toast({
				title: "Update Failed",
				description: "There was an error updating your password.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background/10 p-4">
			<Card className="w-full max-w-md shadow-lg animate-fade-in">
				<CardHeader className="text-center pb-2">
					<div className="flex flex-col items-center mb-3">
						<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
							<ShieldCheck className="w-8 h-8 text-white" />
						</div>
						<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-300/80 mb-1">
							Set New Password
						</CardTitle>
						<CardDescription>
							Choose a strong new password to finish account setup
						</CardDescription>
					</div>
				</CardHeader>
				<div className="bg-emerald-50 dark:bg-emerald-300/5 border border-emerald-200 dark:border-emerald-300/80 border-dashed rounded-lg p-4 mx-6 mb-5 mt-2">
					<p className="text-sm text-emerald-800 dark:text-emerald-300/80 text-center">
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
								className="block text-sm font-medium text-gray-700 dark:text-gray-300/80 mb-2"
								htmlFor="newPassword"
							>
								New Password
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
									<Lock className="w-5 h-5 input-icon" />
								</span>
								<Input
									id="newPassword"
									type="password"
									className="pl-10"
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
						</div>
						<div>
							<Label
								className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300/80"
								htmlFor="confirmPassword"
							>
								Confirm Password
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
									<Lock className="w-5 h-5 input-icon" />
								</span>
								<Input
									id="confirmPassword"
									type="password"
									className="pl-10"
									value={confirmPassword}
									onChange={(e) => {
										setConfirmPassword(e.target.value);
										setPasswordError("");
									}}
									placeholder="Re-enter new password"
									required
									minLength={6}
								/>
								{passwordsMatch && (
									<span className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-500 animate-scale-fade-in">
										<Check className="w-5 h-5 input-icon" />
									</span>
								)}
							</div>
						</div>
						<div
							className={`overflow-hidden transition-all ${
								passwordError ||
								passwordMismatch ||
								passwordTooShort
									? "animate-error-expand"
									: "animate-error-collapse"
							}`}
						>
							<div className="bg-red-50 dark:bg-red-300/5 border border-red-200 dark:border-red-300/60 rounded-lg p-3 w-full flex items-center space-x-2">
								<Info className="text-red-600 dark:text-red-400 w-4 h-4" />
								<p className="text-xs text-red-600 dark:text-red-300/80 justify-self-center">
									{passwordError ||
										(passwordMismatch &&
											"Passwords do not match") ||
										(passwordTooShort &&
											"Password must be at least 6 characters long")}
								</p>
							</div>
						</div>

						<div className="flex space-x-4">
							<Button
								type="button"
								variant="outline"
								className="flex-1"
								onClick={() => {
									onLogout();
									onCancel();
								}}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white transition-colors"
								disabled={!canUpdate}
							>
								{
									isLoading ? "Updating..." : "Update Password"
								}
								
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ChangePasswordForm;
