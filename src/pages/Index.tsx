import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Settings2Icon, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import LoginForm from "@/components/auth/LoginForm";

import { Member } from "@/types/types";
import { useMembers } from "@/hooks/useMembers";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";

import { SettingsSidebar } from "@/components/SettingsSidebar";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";


// Hydration check hook
function useHydrated() {
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		setHydrated(true);
	}, []);
	return hydrated;
}

const Index = () => {
	const hydrated = useHydrated();
	const { members, updateMember } = useMembers();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentUser, setCurrentUser] = useState<Member | null>(null);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	const { settings } = useIslamifySettings();
	const { toast } = useToast();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	useEffect(() => {
		const stored = localStorage.getItem("islamify_logged_in_user");
		if (stored) {
			try {
				const parsed: Member = JSON.parse(stored);

				if (parsed.needsPasswordChange) {
					// Don't auto-login if password change is required
					setCurrentUser(parsed);
					setShowPasswordChange(true);
					return;
				}

				setCurrentUser(parsed);
				setIsLoggedIn(true);
			} catch {
				localStorage.removeItem("islamify_logged_in_user");
			}
		}
	}, []);
	

	const handleLogout = () => {
		localStorage.removeItem("islamify_logged_in_user");
		setIsLoggedIn(false);
		setCurrentUser(null);
		setShowPasswordChange(false);

		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 0);

		toast({
			title: "Logged Out",
			description: "You have been logged out successfully",
		});
	};

	const handleLogin = (user: Member) => {
		localStorage.setItem("islamify_logged_in_user", JSON.stringify(user));
		setCurrentUser(user);
		setIsLoggedIn(true);
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 0);
	};

	const requirePasswordChange = (user: Member) => {
		console.log("here");
		
		setCurrentUser(user);
		setShowPasswordChange(true);
		console.log(showPasswordChange);
		
	};

	const handleOnSuccess = (updatedUser: Member) => {
		localStorage.setItem(
			"islamify_logged_in_user",
			JSON.stringify(updatedUser)
		);
		setCurrentUser(updatedUser);
		setIsLoggedIn(true);
		setShowPasswordChange(false);
		toast({
			title: "Password Updated",
			description: "Your password has been changed successfully",
		});
	};

	if (!hydrated) return null;

	if ((isLoggedIn || showPasswordChange) && currentUser) {
		return showPasswordChange ? (
			<ChangePasswordForm
				member={currentUser}
				onSuccess={handleOnSuccess}
				onCancel={() => {
					setShowPasswordChange(false);
					setIsLoggedIn(false);
				}}
				updateMember={updateMember}
				onLogout={handleLogout}
			/>
		) : currentUser.role === "admin" ? (
			<AdminDashboard user={currentUser} onLogout={handleLogout} />
		) : (
			<MemberDashboard user={currentUser} onLogout={handleLogout} />
		);
	}
	

	return (
		<div className="min-h-screen bg-background">
			<div className="sticky top-0 z-50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-900">
				<div className="mx-auto py-6 flex items-center justify-between px-4">
					<div className="w-10 h-10" aria-hidden="true" />
					<div className="flex flex-col items-center">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
								<Users className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-green-700 bg-clip-text text-transparent">
								{settings.associationName || "Islamify"}
							</h1>
						</div>
						<p className="text-center text-gray-600 dark:text-gray-300 mt-2">
							Association Management System
						</p>
					</div>
					<button
						onClick={() => setIsSettingsOpen(true)}
						className="flex mr-3 items-end space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
						aria-label="Open Settings"
					>
						<Settings2Icon className="w-6 h-6" />
					</button>
				</div>
			</div>

			<SettingsSidebar
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				settings={settings}
				user={currentUser || members[0]}
				updateSettings={() => {}}
			/>

			<div className="mx-auto px-4 py-12 bg-background">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
						Manage Your Association
					</h2>
					<p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
						Track contributions, manage members, and facilitate
						loans with our comprehensive management system
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-12 max-w-7xl mx-auto">
					<Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
						<CardHeader className="text-center">
							<Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
							<CardTitle className="text-xl">
								Member Management
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 text-center">
								Comprehensive member registration, profile
								management, and role-based access control
							</p>
						</CardContent>
					</Card>
					<Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
						<CardHeader className="text-center">
							<TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
							<CardTitle className="text-xl">
								Contribution Tracking
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 text-center">
								Track individual and total contributions with
								detailed reporting and analytics
							</p>
						</CardContent>
					</Card>
					<Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
						<CardHeader className="text-center">
							<CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-4" />
							<CardTitle className="text-xl">
								Loan Management
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-600 text-center">
								Enable loan applications based on contribution
								history with flexible terms
							</p>
						</CardContent>
					</Card>
				</div>

				<LoginForm
					users={members}
					onLogin={handleLogin}
					onRequirePasswordChange={requirePasswordChange}
					toast={toast}
				/>
			</div>
		</div>
	);
};

export default Index;
