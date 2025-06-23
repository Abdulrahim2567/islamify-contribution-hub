
import { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Users, TrendingUp, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminDashboard from "@/components/AdminDashboard";
import MemberDashboard from "@/components/MemberDashboard";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import LoginForm from "@/components/auth/LoginForm";
import {
	addMemberToStorage,
	readMembersFromStorage,
	updateMemberInfo,
} from "@/utils/membersStorage";
import { Member } from "@/types/types";
import { getSettings } from "@/utils/settingsStorage";
import { add } from "date-fns";
import { getNowString } from "@/utils/calculations";

// Default admin user: always present as fallback if localstorage empty
const DEMO_ADMIN: Member = {
	id: 1,
	email: "admin@islamify.org",
	password: "admin123",
	role: "admin",
	name: "Admin User",
	phone: "677941823",
	needsPasswordChange: false,
	registrationFee: 0,
	totalContributions: 0,
	isActive: true,
	loanEligible: false,
	canApplyForLoan: false,
	joinDate: getNowString(),
};

function getPersistedUsers() {
	// Read from localStorage and ensure demo admin is present
	addAdminToMembers(); // Ensure demo admin is added if not present
	const parsed = readMembersFromStorage() || [];
	// Always include the demo admin if not in localStorage
	const hasAdmin = parsed.some((u) => u.email === DEMO_ADMIN.email);
	return hasAdmin ? parsed : [DEMO_ADMIN, ...parsed];
}

function addAdminToMembers() {
	// Always ensure the demo admin remains present in the users list
	const settings = getSettings();
	DEMO_ADMIN.registrationFee = settings.registrationFee || 0;
	addMemberToStorage(DEMO_ADMIN);
}

const Index = () => {
	const [users, setUsers] = useState<Member[]>([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentUser, setCurrentUser] = useState<Member | null>(null);
	const [showPasswordChange, setShowPasswordChange] = useState(false);
	//get settings from localStorage and initialize a useState variable
	const [settings, setSettings] = useState(getSettings());

	const { toast } = useToast();

	// On mount/load: get all users from localStorage (plus demo admin if needed)
	useEffect(() => {
		const localUsers: Member[] = getPersistedUsers();
		setUsers(localUsers);
	}, []);

	// On settings change, update the demo admin's registration fee
	useEffect(() => {
		if (settings.registrationFee !== undefined) {
		DEMO_ADMIN.registrationFee = settings.registrationFee;
		addAdminToMembers(); // Ensure demo admin is updated in localStorage
		}
	}, [settings.registrationFee]);

	//on settings change, update the state
	useEffect(() => {
		setSettings(getSettings());
	}, []);

	// Helper: write users to both state and localStorage
	const updateUsers = (newUsers: Member[]) => {
		setUsers(getPersistedUsers());
	};

	const handleLogout = () => {
		// Prevent auto-scroll by maintaining current scroll position
		const currentScrollY = window.scrollY;
		
		setIsLoggedIn(false);
		setCurrentUser(null);
		setShowPasswordChange(false);
		
		// Restore scroll position after state updates
		setTimeout(() => {
			window.scrollTo(0, currentScrollY);
		}, 0);
		
		toast({
			title: "Logged Out",
			description: "You have been logged out successfully",
		});
	};

	const handleLogin = (user: Member) => {
		// Prevent auto-scroll during login
		const currentScrollY = window.scrollY;
		
		setCurrentUser(user);
		setIsLoggedIn(true);
		
		// Maintain scroll position
		setTimeout(() => {
			window.scrollTo(0, currentScrollY);
		}, 0);
	};

	const requirePasswordChange = (user: Member) => {
		setCurrentUser(user);
		setShowPasswordChange(true);
	};

	const handleOnSuccess = (updatedUser: Member) => {
		setCurrentUser(updatedUser);
		setIsLoggedIn(true);
		setShowPasswordChange(false);
		toast({
			title: "Password Updated",
			description: "Your password has been changed successfully",
		});
		//update the users in localStorage with updated user password and set needsPasswordChange to false
		updatedUser.needsPasswordChange = false;
		updateMemberInfo(updatedUser.id, { ...updatedUser });
		const updatedUsers = users.map((u) =>
			u.email === updatedUser.email ? updatedUser : u
		);
		setUsers(updatedUsers);
	};

	if (showPasswordChange && currentUser) {
		return (
			<ChangePasswordForm
				user={currentUser}
				users={users}
				setUsers={updateUsers}
				onSuccess={(updatedUser) => {
					handleOnSuccess(updatedUser);
				}}
				onCancel={() => {
					setShowPasswordChange(false);
					setIsLoggedIn(false);
				}}
			/>
		);
	}

	if (isLoggedIn && currentUser) {
		return currentUser.role === "admin" ? (
			<AdminDashboard
				user={currentUser}
				onLogout={handleLogout}
				onNewUser={updateUsers}
				users={users}
			/>
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
							{settings.associationName || "Islamify"}
						</h1>
					</div>
					<p className="text-center text-gray-600 mt-2">
						Association Management System
					</p>
				</div>
			</div>

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-12">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-800 mb-4">
						Manage Your Association
					</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Track contributions, manage members, and facilitate
						loans with our comprehensive management system
					</p>
				</div>

				{/* Features */}
				<div className="grid md:grid-cols-3 gap-8 mb-12">
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
							<LogIn className="w-12 h-12 text-purple-600 mx-auto mb-4" />
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
