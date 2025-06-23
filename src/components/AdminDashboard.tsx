import React, { useState, useEffect } from "react";
import {
	Search,
	DollarSign,
	Grid,
	List,
	User,
	CreditCard,
	Clock,
	ChevronDown,
	LogOut,

} from "lucide-react";
import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ui/ThemeProvider";
import MemberCard from "./admin/MemberCard";
import MemberTable from "./admin/MemberTable";
import MemberDetailModal from "./admin/MemberDetailModal";
import RegisterMemberDialog from "./admin/RegisterMemberDialog";
import SuccessModal from "./admin/SuccessModal";
import type {
	AdminLoanActivity,
	Contribution,
	ContributionRecordActivity,
	LoanRequest,
	Member,
	MemberLoanActivity,
} from "../types/types";
import AddContributionStepper from "./admin/AddContributionStepper";
import { addMemberToStorage, deleteMemberFromStorage, readMembersFromStorage, updateMemberActiveStatus, updateMemberInfo, updateMemberLoanEligibility, updateMemberRole, writeMembersToStorage } from "../utils/membersStorage";
import AdminStatsCards from "./admin/AdminStatsCards";
import AdminRecentActivity from "./admin/AdminRecentActivity";
import AdminSettingsForm from "./admin/AdminSettingsForm";
import AdminContributionsTable from "./admin/AdminContributionsTable";
import LoanApplication from "./member/LoanApplication";
import LoanManagement from "./admin/LoanManagement";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import { formatCurrency, getNowString } from "../utils/calculations";
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { initializeSettings, getSettings } from "../utils/settingsStorage";
import { AdminActivityLog } from "../types/types";
import { addContribution, getTotalContributions, getTotalMemberContributions } from "@/utils/contributionStorage";
import {
	getAdminRecentActivities,
	getAllContributionsActivitiesForMember,
	getMemberLoanActivitiesByMember,
	saveMemberContributionActivity,
} from "@/utils/recentActivities";
import { getTotalRegistrationFees } from "@/utils/registrationFees";
import { getLoanRequestsByMemberId } from "@/utils/loanStorage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { UserDropdown } from "./ui/UserDropdown";
import { NotificationDropdown } from "./ui/NotificationDropdown";

// Add this type for the new member state
type NewMember = {
	name: string;
	email: string;
	phone: string;
	role: "member" | "admin";
};

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_admin_recent_activities";

interface AdminDashboardProps {
	user: Member,
	onLogout: ()=> void,
	onNewUser: (member:Member[])=> void,
	users: Member[]
}


const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onNewUser, users }) => {
	const [members, setMembers] = useState<Member[]>([]);
	const [activeTab, setActiveTab] = useState("dashboard");
	const [searchTerm, setSearchTerm] = useState("");
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
	const [newMember, setNewMember] = useState<NewMember>({
		name: "",
		email: "",
		phone: "",
		role: "member",
	});
	const [generatedPassword, setGeneratedPassword] = useState("");
	const [showContributionModal, setShowContributionModal] = useState(false);
	const [targetMemberId, setTargetMemberId] = useState<number | null>(null);
	const [settings, setSettings] = useState(getSettings());
	const [cardsShouldAnimate, setCardsShouldAnimate] = useState(false);
	const [activityPage, setActivityPage] = useState(1);
	const perPage = 10;
	const [showLoanModal, setShowLoanModal] = useState(false);
	const [membersPage, setMembersPage] = useState(1);
	const [membersPerPage, setMembersPerPage] = useState(12);
	const { toast } = useToast();
	const [showAddContributionStepper, setShowAddContributionStepper] =
		useState(false);
	// Retrieve from localStorage only on mount
	const [activities, setActivities] = useState<AdminActivityLog[]>(() => {
		try {
			return getAdminRecentActivities();
		} catch {
			return [];
		}
	});
	const [memberLoans, setMemberLoans] = useState<LoanRequest[]>([]);

	// Store all activities for this member (contributions history)
		const [memberContributionActivities, setMemberContributionActivities] =
			useState<ContributionRecordActivity[]>();
		const [memberLoanAcivities, setMemberLoanActivities] = useState<MemberLoanActivity[]>()
	
		useEffect(() => {
			setMembers(readMembersFromStorage());
			setMemberContributionActivities(
				getAllContributionsActivitiesForMember(user.id)
			);
			setMemberLoanActivities(getMemberLoanActivitiesByMember(user.id))
		}, []);

	useEffect(() => {
		try {
			const storedLoans: LoanRequest[] = getLoanRequestsByMemberId(
				user.id
			);
			if (storedLoans) {
				setMemberLoans(storedLoans);
			}
		} catch (error) {
			console.error("Error loading member loans:", error);
		}
	}, [user.id, activeTab]);

	// Always load members from localStorage. If empty, create/save DEMO_ADMIN as sole member.
	const DEMO_ADMIN_MEMBER: Member = {
		id: 1,
		name: "Admin User",
		email: "admin@islamify.org",
		phone: "677947823",
		password: "admin123", // Default password for demo
		needsPasswordChange: false, // must change password on first login
		registrationFee: 0,
		totalContributions: 0,
		isActive: true,
		loanEligible: false,
		canApplyForLoan: false,
		joinDate: getNowString(),
		role: "admin",
	};

	useEffect(() => {
		// On mount: get members from localStorage, fallback only to DEMO_ADMIN_MEMBER.
		const loaded = readMembersFromStorage();
		if (loaded.length > 0) {
			setMembers(loaded);
		} else {
			setMembers([DEMO_ADMIN_MEMBER]);
			writeMembersToStorage([DEMO_ADMIN_MEMBER]);
		}
	}, []);

	useEffect(() => {
		const syncMembers = () => {
			const loaded = readMembersFromStorage();
			setMembers(loaded.length > 0 ? loaded : [DEMO_ADMIN_MEMBER]);
		};
		window.addEventListener("storage", syncMembers);
		return () => window.removeEventListener("storage", syncMembers);
	}, []);

	// NEW: Add this useEffect to initialize settings on component mount
	useEffect(() => {
		initializeSettings();
	}, []);

	// Every time activities changes, update localStorage
	useEffect(() => {
		localStorage.setItem(
			ACTIVITY_LOCALSTORAGE_KEY,
			JSON.stringify(activities)
		);
	}, [activities]);

	// Reset page when search changes
	useEffect(() => {
		setMembersPage(1);
	}, [searchTerm, membersPerPage]);

	//re-render component each time settings change
	useEffect(() => {
		setSettings(getSettings());
	}, [
		settings.associationName,
		settings.registrationFee,
		settings.maxLoanMultiplier,
	]);

	// Helper to persist and update (never fallback to mock)
	const persistAndSetMembers = (updateFn) => {
		setMembers((prev) => {
			const updated =
				typeof updateFn === "function" ? updateFn(prev) : updateFn;
			// Ensure DEMO_ADMIN_MEMBER is always present
			const hasDemoAdmin = updated.some(
				(u) => u.email === DEMO_ADMIN_MEMBER.email
			);
			const finalMembers = hasDemoAdmin
				? updated
				: [DEMO_ADMIN_MEMBER, ...updated];
			return finalMembers;
		});
	};

	// Helper to always persist after updates (activities)
	const persistAndSetActivities = (activityOrUpdateFn) => {
		setActivities((prev) => {
			let updated;
			if (typeof activityOrUpdateFn === "function") {
				updated = activityOrUpdateFn(prev);
			} else {
				// Accept single activity or array
				updated = Array.isArray(activityOrUpdateFn)
					? activityOrUpdateFn
					: [activityOrUpdateFn, ...prev];
			}
			// No need to set localStorage here, useEffect handles it
			return updated;
		});
	};

	const generatePassword = () => {
		const chars =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let password = "";
		for (let i = 0; i < 8; i++) {
			password += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return password;
	};

	const filteredMembers = members.filter(
		(member) =>
			member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			member.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Pagination logic for members
	const totalMembersPages = Math.ceil(
		filteredMembers.length / membersPerPage
	);
	const paginatedMembers = filteredMembers.slice(
		(membersPage - 1) * membersPerPage,
		membersPage * membersPerPage
	);

	// Handle page change
	const handleMembersPageChange = (page: number) => {
		if (page < 1 || page > totalMembersPages) return;
		setMembersPage(page);
	};

	const handleRegisterMember = (e) => {
		e.preventDefault();
		const password = generatePassword();
		const id = Date.now(); // Use timestamp for uniqueness
		const member: Member = {
			id,
			name: newMember.name,
			email: newMember.email,
			phone: newMember.phone,
			password,
			needsPasswordChange: true, // must change password on first login
			role: newMember.role,
			registrationFee: settings.registrationFee,
			totalContributions: 0,
			isActive: true,
			loanEligible: false,
			joinDate: getNowString(),
		};

		persistAndSetMembers([...members, member]);

		// Set the generated password BEFORE showing the success modal
		setGeneratedPassword(password);

		//add user to localStorage users
		addMemberToStorage(member);

		// Close register modal first
		setShowRegisterModal(false);

		// Reset form
		setNewMember({ name: "", email: "", phone: "", role: "member" });

		// Show success modal with generated password
		setShowSuccessModal(true);

		// Activity log with admin name/email
		const AdminActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "add_member",
			text: `Added new member "${member.name}" (${member.email}) as ${member.role}`,
			color: "emerald",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: id, // Include member ID for reference
		};
		persistAndSetActivities(AdminActivity);

		toast({
			title: "Member Registered",
			description: `${member.name} has been successfully registered`,
		});
	};

	const toggleMemberStatus = (id) => {
		persistAndSetMembers((members) =>
			members.map((member) =>
				member.id === id
					? { ...member, isActive: !member.isActive }
					: member
			)
		);

		const member = members.find((m) => m.id === id);
		updateMemberActiveStatus(id, !member.isActive);
		const statusActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "toggle_status",
			text: `Changed status of "${member?.name}" to ${
				member?.isActive ? "Active" : "Inactive"
			}`,
			color: "orange",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: id, // Include member ID for reference
		};
		persistAndSetActivities(statusActivity);

		toast({
			title: "Member Status Updated",
			description: "Member status has been changed successfully",
		});
	};

	const toggleLoanEligibility = (id) => {
		persistAndSetMembers((members) =>
			members.map((member) =>
				member.id === id
					? { ...member, loanEligible: !member.loanEligible }
					: member
			)
		);
		const member = members.find((m) => m.id === id);
		// Update loan eligibility in localStorage
		updateMemberLoanEligibility(id, !member.loanEligible);
		const loanEligibilityActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "toggle_loan_eligibility",
			text: `Changed loan eligibility for "${member?.name}" to ${
				member?.loanEligible ? "Enabled" : "Disabled"
			}`,
			color: "indigo",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: id, // Include member ID for reference
		};
		// Add to activities
		persistAndSetActivities(loanEligibilityActivity);

		toast({
			title: "Loan Eligibility Updated",
			description:
				"Member loan eligibility has been changed successfully",
		});
	};

	const deleteMember = (id) => {
		const member = members.find((m) => m.id === id);

		persistAndSetMembers((members) =>
			members.filter((member) => member.id !== id)
		);

		deleteMemberFromStorage(id);

		const deleteActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "delete_member",
			text: `Deleted member "${member?.name}" (${member?.email})`,
			color: "red",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: id, // Include member ID for reference
		};

		persistAndSetActivities(deleteActivity);

		toast({
			title: "Member Deleted",
			description: "Member has been removed from the system",
			variant: "destructive",
		});
	};

	const totalMembers = members.length;
	const activeMembers = members.filter((m) => m.isActive).length;
	const inactiveMembers = totalMembers - activeMembers;
	const totalContributions = getTotalContributions();
	const totalRegistrationFees = getTotalRegistrationFees();

	const { theme, accent } = useTheme();

	const handleAddContributionStepper = ({
		memberId,
		amount,
		type,
		date,
		description,
	}: {
		memberId: number;
		amount: number;
		type: "contribution";
		date: string;
		description?: string;
	}) => {
		const member = members.find((m) => m.id === memberId);
		persistAndSetMembers((members) =>
			members.map((m) =>
				m.id === memberId
					? {
							...m,
							totalContributions: m.totalContributions + amount,
					  }
					: m
			)
		);

		//readMemberfromStorage and update the member's total contributions
		const updatedMembers = readMembersFromStorage();
		const memberIndex = updatedMembers.findIndex((m) => m.id === memberId);
		if (memberIndex !== -1) {
			updatedMembers[memberIndex].totalContributions += amount;
			writeMembersToStorage(updatedMembers);
		}
		// Update loan eligibility if contributions exceed threshold
		if (
			updatedMembers[memberIndex].totalContributions >
			settings.loanEligibilityThreshold
		) {
			updatedMembers[memberIndex].canApplyForLoan = true;
		}
		writeMembersToStorage(updatedMembers);

		// Log in admin activities
		const adminAddContributionActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "add_contribution",
			text: `Added contribution of ${amount.toLocaleString()} XAF for "${
				member?.name
			}"${description ? ` (${description})` : ""}`,
			color: "cyan",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: member.id, // Include member ID for reference
		};

		persistAndSetActivities(adminAddContributionActivity);

		const newContribution: Contribution = {
			id: Date.now() + Math.random(),
			memberId,
			amount,
			date,
			lastEdited: "",
			description: description || "",
			addedBy: user.name,
			type: "contribution",
		};
		addContribution(newContribution);
		// ------------ IMPORTANT PART: update islamify_recent_activities for member dashboards ------------

		// Prepare activity object for member dashboard
		const memberContributionActivity: ContributionRecordActivity = {
			id: Date.now() + Math.random(),
			type: "contribution",
			amount,
			memberId,
			memberName: member?.name || "",
			date,
			lastEdited: "",
			editedBy: user.name,
			description: description || "",
			addedBy: user.name,
		};
		// Save this activity to localStorage for member dashboard
		saveMemberContributionActivity(memberContributionActivity);

		// ------------ END IMPORTANT PART ------------

		setShowAddContributionStepper(false);
		setTargetMemberId(null);
		toast({
			title: "Contribution Added",
			description: `Added ${amount.toLocaleString()} XAF contribution.`,
		});
	};

	// NEW: Change role handler
	const handleChangeRole = (id: number, newRole: "member" | "admin") => {
		persistAndSetMembers((members) =>
			members.map((m) => (m.id === id ? { ...m, role: newRole } : m))
		);
		// Find the member for the user
		const member = members.find((m) => m.id === id);
		updateMemberRole(id, newRole);
		if (member) {
			// Find the index of the user matching the member's email.
			const roleChangeActivity: AdminActivityLog = {
				id: Date.now() + Math.random(),
				timestamp: getNowString(),
				type: "change_role",
				text: `Changed role for "${member.name}" (${member.email}) to ${newRole}`,
				color: "purple",
				adminName: user.name,
				adminEmail: user.email,
				adminRole: user.role,
				memberId: id, // Include member ID for reference
			};
			persistAndSetActivities(roleChangeActivity);
		}

		toast({
			title: "Role Updated",
			description: `Member role changed to ${newRole}`,
		});
	};

	// Edit member handler
	const handleEditMember = (
		id: number,
		data: { name: string; email: string; phone: string }
	) => {
		persistAndSetMembers((members) =>
			members.map((m) => (m.id === id ? { ...m, ...data } : m))
		);
		updateMemberInfo(id, { ...data });

		//create edit activity
		const edit_member_activity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "edit_member",
			text: `Edited details for "${data.name}" (${data.email})`,
			color: "blue",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: id, // Include member ID for reference
		};
		// Add to activities
		persistAndSetActivities(edit_member_activity);

		toast({
			title: "Member Updated",
			description: "Member details updated successfully",
		});
	};

	// PAGINATION LOGIC FOR ACTIVITIES
	const paginatedActivities = activities.slice(
		(activityPage - 1) * perPage,
		activityPage * perPage
	);
	const totalPages = Math.ceil(activities.length / perPage);

	// Handler for pagination clicks
	const handleActivityPageChange = (page: number) => {
		if (page < 1 || page > totalPages) return;
		setActivityPage(page);
	};

	// For admin, find "self" as a member record, e.g., by email
	const thisAdminMember = members.find(
		(m) => m.email === user.email || m.id === user.id
	);

	// For loan, use sum of admin's contributions (like member dashboard logic)
	const adminMemberId = thisAdminMember?.id ?? user.id;
	// Fallback: If no member record, default contributions to 0
	const adminContributions = getTotalMemberContributions(adminMemberId) || 0;
	const adminMaxLoanAmount = adminContributions * settings.maxLoanMultiplier;

	// Allow admin to apply for loan if they are found as a member and eligible
	const adminCanApplyForLoan =
		thisAdminMember?.canApplyForLoan && thisAdminMember?.loanEligible;

	// Check if member has pending loan application
	const hasPendingLoan = memberLoans.some(
		(loan) => loan.status === "pending"
	);

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-gray-50">
				<AppSidebar
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onLogout={onLogout}
					user={user}
				/>
				<SidebarInset>
					{/* Header */}
					<div className="bg-white border-b border-gray-200 px-6 py-4">
						<div className="flex items-center justify-between">
							{/* LEFT SIDE: Logo + Welcome */}
							<div className="flex items-center space-x-4">
								<SidebarTrigger />
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
										<User className="w-6 h-6 text-white" />
									</div>
									<div>
										<h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
											{settings.associationName}
										</h1>
										<p className="text-sm text-gray-600">
											Welcome back, {user.name}
										</p>
									</div>
								</div>
							</div>

							{/* RIGHT SIDE: User Menu */}
							<div className="ml-auto relative flex">
								<UserDropdown user={user} onLogout={onLogout} />
								<NotificationDropdown
									notifications={activities} itemsPerPage={10} user={user} memberLoans={memberLoanAcivities} contributions={memberContributionActivities}
								/>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="p-6">
						{activeTab === "dashboard" && (
							<>
								<div className="mb-8">
									<h1 className="text-3xl font-bold text-gray-900 mb-2">
										Admin Dashboard
									</h1>
									<p className="text-gray-600">
										Manage your association finances
									</p>
								</div>
								{/* Stats Cards */}
								<AdminStatsCards
									totalMembers={totalMembers}
									activeMembers={activeMembers}
									inactiveMembers={inactiveMembers}
									totalContributions={totalContributions}
									totalRegistrationFees={
										totalRegistrationFees
									}
								/>

								{/* Allow admin to apply for a loan (just like member dashboard) */}
								{adminCanApplyForLoan && !hasPendingLoan && (
									<div className="flex justify-end mb-6">
										<button
											className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all"
											onClick={() =>
												setShowLoanModal(true)
											}
										>
											<CreditCard className="w-5 h-5" />
											Apply For Loan
										</button>
									</div>
								)}
								{hasPendingLoan && (
									<div className="flex justify-end mb-6 rounded-lg">
										<div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-[25px] font-medium flex items-center gap-2">
											<Clock className="w-5 h-5" />
											Loan Application Pending
										</div>
									</div>
								)}
								{showLoanModal && (
									<LoanApplication
										memberId={String(adminMemberId)}
										memberName={
											thisAdminMember?.name || user.name
										}
										memberEmail={
											thisAdminMember?.email || user.email
										}
										maxAmount={adminMaxLoanAmount}
										maxLoanMultiplier={
											settings.maxLoanMultiplier
										}
										onSubmit={(data) => {
											setShowLoanModal(false);
											// Show a toast notification
											toast({
												title: "Loan Application Submitted",
												description: `Your application for ${formatCurrency(
													data.amount
												)} is pending.`,
											});
											// Reload loans to show the new application
											const userLoans =
												getLoanRequestsByMemberId(
													user.id
												);
											if (userLoans) {
												setMemberLoans(userLoans);
											}
										}}
										onCancel={() => setShowLoanModal(false)}
									/>
								)}

								{/* Recent Activity */}
								<AdminRecentActivity
									activities={activities}
									paginatedActivities={paginatedActivities}
									totalPages={totalPages}
									activityPage={activityPage}
									onActivityPageChange={
										handleActivityPageChange
									}
								/>
							</>
						)}

						{activeTab === "members" && (
							<>
								{/* Header Section */}
								<div className="mb-8 flex justify-between items-center">
									<div>
										<h1 className="text-3xl font-bold text-gray-900 mb-2">
											Members Management
										</h1>
										<p className="text-gray-600">
											Manage association members and their
											contributions
										</p>
									</div>
									<div className="flex items-center space-x-4">
										<div className="flex items-center space-x-2">
											<button
												onClick={() => {
													setViewMode("table");
													setCardsShouldAnimate(
														false
													);
												}}
												className={`p-2 rounded-lg ${
													viewMode === "table"
														? "bg-emerald-100 text-emerald-600"
														: "text-gray-400 hover:text-gray-600"
												}`}
											>
												<List size={20} />
											</button>
											<button
												onClick={() => {
													setViewMode("card");
													setCardsShouldAnimate(true);
													setTimeout(
														() =>
															setCardsShouldAnimate(
																false
															),
														700
													);
												}}
												className={`p-2 rounded-lg ${
													viewMode === "card"
														? "bg-emerald-100 text-emerald-600"
														: "text-gray-400 hover:text-gray-600"
												}`}
											>
												<Grid size={20} />
											</button>
										</div>
										{/* Add Contribution Button (opens stepper) */}
										<button
											className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
											onClick={() =>
												setShowAddContributionStepper(
													true
												)
											}
											type="button"
											aria-label="Add contribution"
										>
											<DollarSign size={20} />
											Add Contribution
										</button>
										<RegisterMemberDialog
											open={showRegisterModal}
											registrationFee={
												settings.registrationFee
											}
											onOpenChange={setShowRegisterModal}
											newMember={newMember}
											setNewMember={setNewMember}
											onSubmit={handleRegisterMember}
										/>
									</div>
								</div>

								<AddContributionStepper
									open={showAddContributionStepper}
									onOpenChange={setShowAddContributionStepper}
									members={members}
									onSubmit={handleAddContributionStepper}
								/>

								{/* Search and Pagination Controls */}
								<div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
									<div className="relative flex-1 max-w-md">
										<Search
											className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
											size={20}
										/>
										<input
											type="text"
											value={searchTerm}
											onChange={(e) =>
												setSearchTerm(e.target.value)
											}
											className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
											placeholder="Search members..."
										/>
									</div>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<Label
												htmlFor="members-per-page"
												className="text-sm text-gray-600"
											>
												Per page:
											</Label>
											<Select
												value={membersPerPage.toString()}
												onValueChange={(value) =>
													setMembersPerPage(
														Number(value)
													)
												}
											>
												<SelectTrigger className="w-20">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="6">
														6
													</SelectItem>
													<SelectItem value="12">
														12
													</SelectItem>
													<SelectItem value="24">
														24
													</SelectItem>
													<SelectItem value="48">
														48
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
										<div className="text-sm text-gray-600">
											Showing{" "}
											{Math.min(
												(membersPage - 1) *
													membersPerPage +
													1,
												filteredMembers.length
											)}
											-
											{Math.min(
												membersPage * membersPerPage,
												filteredMembers.length
											)}{" "}
											of {filteredMembers.length} members
										</div>
									</div>
								</div>

								{/* Members Display */}
								{viewMode === "card" ? (
									<>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
											{paginatedMembers.map(
												(member, idx) => (
													<div
														key={member.id}
														className={
															cardsShouldAnimate
																? "animate-fade-in animate-scale-in"
																: ""
														}
														style={{
															animationDelay:
																cardsShouldAnimate
																	? idx * 70 +
																	  "ms"
																	: undefined,
															animationFillMode:
																cardsShouldAnimate
																	? "both"
																	: undefined,
														}}
													>
														<MemberCard
															member={member}
															currentUser={user}
															onView={
																setSelectedMember
															}
															onStatusToggle={
																toggleMemberStatus
															}
															onLoanToggle={
																toggleLoanEligibility
															}
															onDelete={
																deleteMember
															}
															onRoleChange={
																handleChangeRole
															}
															onEdit={
																handleEditMember
															}
														/>
													</div>
												)
											)}
										</div>

										{/* Pagination for Cards */}
										{totalMembersPages > 1 && (
											<div className="mt-8 flex justify-center">
												<Pagination>
													<PaginationContent>
														{membersPage > 1 && (
															<PaginationItem>
																<PaginationPrevious
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			membersPage -
																				1
																		);
																		setCardsShouldAnimate(
																			true
																		);
																		setTimeout(
																			() =>
																				setCardsShouldAnimate(
																					false
																				),
																			700
																		);
																	}}
																/>
															</PaginationItem>
														)}

														{Array.from(
															{
																length: totalMembersPages,
															},
															(_, i) => i + 1
														).map((page) => (
															<PaginationItem
																key={page}
															>
																<PaginationLink
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			page
																		);
																		setCardsShouldAnimate(
																			true
																		);
																		setTimeout(
																			() =>
																				setCardsShouldAnimate(
																					false
																				),
																			700
																		);
																	}}
																	isActive={
																		page ===
																		membersPage
																	}
																>
																	{page}
																</PaginationLink>
															</PaginationItem>
														))}

														{membersPage <
															totalMembersPages && (
															<PaginationItem>
																<PaginationNext
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			membersPage +
																				1
																		);
																		setCardsShouldAnimate(
																			true
																		);
																		setTimeout(
																			() =>
																				setCardsShouldAnimate(
																					false
																				),
																			700
																		);
																	}}
																/>
															</PaginationItem>
														)}
													</PaginationContent>
												</Pagination>
											</div>
										)}
									</>
								) : (
									<>
										<div className="min-h-[400px]">
											<MemberTable
												members={members}
												onView={setSelectedMember}
												onStatusToggle={
													toggleMemberStatus
												}
												onLoanToggle={
													toggleLoanEligibility
												}
												onDelete={deleteMember}
												searchTerm={searchTerm}
												onRoleChange={handleChangeRole}
												onEdit={handleEditMember}
											/>
										</div>

										{/* Pagination for Table */}
										{totalMembersPages > 1 && (
											<div className="mt-6 flex justify-center">
												<Pagination>
													<PaginationContent>
														{membersPage > 1 && (
															<PaginationItem>
																<PaginationPrevious
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			membersPage -
																				1
																		);
																	}}
																/>
															</PaginationItem>
														)}

														{Array.from(
															{
																length: totalMembersPages,
															},
															(_, i) => i + 1
														).map((page) => (
															<PaginationItem
																key={page}
															>
																<PaginationLink
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			page
																		);
																	}}
																	isActive={
																		page ===
																		membersPage
																	}
																>
																	{page}
																</PaginationLink>
															</PaginationItem>
														))}

														{membersPage <
															totalMembersPages && (
															<PaginationItem>
																<PaginationNext
																	href="#"
																	onClick={(
																		e
																	) => {
																		e.preventDefault();
																		handleMembersPageChange(
																			membersPage +
																				1
																		);
																	}}
																/>
															</PaginationItem>
														)}
													</PaginationContent>
												</Pagination>
											</div>
										)}
									</>
								)}
							</>
						)}

						{activeTab === "contributions" &&
							user.role === "admin" && (
								<React.Suspense
									fallback={<div>Loading...</div>}
								>
									<AdminContributionsTable />
								</React.Suspense>
							)}

						{activeTab === "loans" && (
							<LoanManagement user={user} />
						)}

						{activeTab === "settings" && (
							<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
								<div className="mb-8">
									<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
										Settings
									</h1>
									<p className="text-gray-600 dark:text-gray-300">
										Manage association configuration
									</p>
								</div>
								<div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
									<AdminSettingsForm
										settings={settings}
										setSettings={setSettings}
										member={thisAdminMember}
									/>
								</div>
							</div>
						)}
					</div>

					{/* Member Detail Modal - Add this inside SidebarInset but outside the main content */}
					{selectedMember && (
						<MemberDetailModal
							member={selectedMember}
							onClose={() => setSelectedMember(null)}
						/>
					)}
				</SidebarInset>

				{/* Success Modal - moved outside SidebarInset to ensure proper rendering */}
				<SuccessModal
					open={showSuccessModal}
					onOpenChange={setShowSuccessModal}
					generatedPassword={generatedPassword}
				/>
			</div>
		</SidebarProvider>
	);
};

export default AdminDashboard;
