import React, { useState, useEffect } from "react";
import {
	Search,
	DollarSign,
	Grid,
	List,
	User,
	CreditCard,
	Clock,
	Check,
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
import MemberCard from "./admin/member/MemberCard";
import MemberTable from "./admin/member/MemberTable";
import MemberDetailModal from "./admin/member/MemberDetailModal";
import RegisterMemberDialog from "./admin/member/RegisterMemberDialog";
import SuccessModal from "./admin/member/SuccessModal";
import type {
	Contribution,
	ContributionRecordActivity,
	Member,
} from "../types/types";
import AddContributionStepper from "@/components/admin/contribution/AddContributionStepper";

import AdminStatsCards from "./admin/dashboard/AdminStatsCards";
import AdminRecentActivity from "./admin/dashboard/AdminRecentActivity";
import AdminSettingsForm from "./admin/settings/AdminSettingsForm";
import AdminContributionsTable from "./admin/contribution/AdminContributionsTable";
import LoanApplication from "./member/LoanApplication";
import LoanManagement from "@/components/admin/loan/LoanManagement";
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
import { AdminActivityLog } from "../types/types";

import { UserDropdown } from "./ui/UserDropdown";
import { NotificationDropdown } from "./ui/NotificationDropdown";
import { useMembers } from "@/hooks/useMembers";
import { useContributions } from "@/hooks/useContributions";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";
import { Input } from "./ui/input";

// Add this type for the new member state
type NewMember = {
	name: string;
	email: string;
	phone: string;
	role: "member" | "admin";
};

interface AdminDashboardProps {
	user: Member;
	onLogout: () => void;
	users: Member[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
	user,
	onLogout,
	users,
}) => {
	const { members, addMember, updateMember, deleteMember } = useMembers();
	const {
		addMemberContribution,
		getTotalAllContributions,
		getTotalContributionsByMember,
		deleteAllMemberContributions,
	} = useContributions();
	const { getLoanRequestsByMemberId } = useLoanRequests();
	const {
		adminActivities,
		memberLoanActivities,
		memberContributionActivities,
		saveAdminActivity,
		saveContributionActivity,
	} = useRecentActivities();
	const { settings, updateSettings } = useIslamifySettings();
	const [activeTab, setActiveTab] = useState("dashboard");
	const [searchTerm, setSearchTerm] = useState("");
	const [searchStatus, setSearchStatus] = useState<
		"idle" | "typing" | "done"
	>("idle");
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
	const [cardsShouldAnimate, setCardsShouldAnimate] = useState(false);
	const perPage = 10;
	const [showLoanModal, setShowLoanModal] = useState(false);
	const [membersPage, setMembersPage] = useState(1);
	const [membersPerPage, setMembersPerPage] = useState(12);
	const { toast } = useToast();
	const [showAddContributionStepper, setShowAddContributionStepper] =
		useState(false);

	// Reset page when search changes
	useEffect(() => {
		setMembersPage(1);
	}, [searchTerm, membersPerPage]);

	useEffect(() => {
		if (searchTerm === "") {
			setSearchStatus("idle");
			return;
		}

		setSearchStatus("typing");

		const timeout = setTimeout(() => {
			setSearchStatus("done");
		}, 300); // debounce duration

		return () => clearTimeout(timeout);
	}, [searchTerm]);

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
			canApplyForLoan: false,
		};

		// Set the generated password BEFORE showing the success modal
		setGeneratedPassword(password);

		//add user to localStorage users
		addMember(member);

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
		saveAdminActivity(AdminActivity);

		toast({
			title: "Member Registered",
			description: `${member.name} has been successfully registered`,
		});
	};

	const toggleMemberStatus = (memberId: number) => {
		const member = members.find((m) => m.id === memberId);
		member.isActive = !member.isActive;
		updateMember(member.id, member);
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
			memberId: member.id, // Include member ID for reference
		};
		saveAdminActivity(statusActivity);

		toast({
			title: "Member Status Updated",
			description: "Member status has been changed successfully",
		});
	};

	const toggleLoanEligibility = (memberId: number) => {
		const member = members.find((m) => m.id === memberId);
		// Update loan eligibility in localStorage
		member.loanEligible = !member.loanEligible;
		updateMember(member.id, member);
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
			memberId: member.id, // Include member ID for reference
		};
		// Add to activities
		saveAdminActivity(loanEligibilityActivity);

		toast({
			title: "Loan Eligibility Updated",
			description:
				"Member loan eligibility has been changed successfully",
		});
	};

	const handleDeleteMember = (memberId: number) => {
		const member = members.find((m) => m.id === memberId);

		//delete member from storage
		deleteMember(memberId);

		const deleteActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "delete_member",
			text: `Deleted member "${member?.name}" (${member?.email})`,
			color: "red",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: member.id, // Include member ID for reference
		};
		saveAdminActivity(deleteActivity);

		if (deleteAllMemberContributions(member.id)) {
			toast({
				title: "Member Deleted",
				description: "Member has been removed from the system",
				variant: "destructive",
			});
		}
	};

	const totalMembers = members.length;
	const activeMembers = members.filter((m) => m.isActive).length;
	const inactiveMembers = totalMembers - activeMembers;
	const totalContributions = getTotalAllContributions();
	const totalRegistrationFees = members.reduce(
		(sum, member) => sum + member.registrationFee,
		0
	);

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

		member.totalContributions += amount;
		// Update loan eligibility if contributions exceed threshold
		if (member.totalContributions > settings.loanEligibilityThreshold) {
			member.canApplyForLoan = true;
		}
		//update member with new info
		updateMember(member.id, member);

		// Log in admin activities
		const adminAddContributionActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "add_contribution",
			text: `Added contribution of ${formatCurrency(amount)} for "${
				member?.name
			}"${description ? ` (${description})` : ""}`,
			color: "cyan",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: member.id, // Include member ID for reference
		};

		saveAdminActivity(adminAddContributionActivity);

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
		addMemberContribution(newContribution);
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
		saveContributionActivity(memberContributionActivity);

		// ------------ END IMPORTANT PART ------------

		setShowAddContributionStepper(false);
		toast({
			title: "Contribution Added",
			description: `Added ${amount.toLocaleString()} XAF contribution.`,
		});
	};

	// NEW: Change role handler
	const handleChangeRole = (
		memberId: number,
		newRole: "member" | "admin"
	) => {
		// Find the member for the user
		const member = members.find((m) => m.id === memberId);

		member.role = newRole;
		updateMember(member.id, member);
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
			memberId: member.id, // Include member ID for reference
		};
		saveAdminActivity(roleChangeActivity);

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
		updateMember(id, { ...data });

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
		saveAdminActivity(edit_member_activity);

		toast({
			title: "Member Updated",
			description: "Member details updated successfully",
		});
	};

	const totalPages = Math.ceil(adminActivities.length / perPage);

	// For admin, find "self" as a member record, e.g., by email
	const thisAdminMember = members.find(
		(m) => m.email === user.email || m.id === user.id
	);

	// For loan, use sum of admin's contributions (like member dashboard logic)
	const adminMemberId = thisAdminMember?.id ?? user.id;
	// Fallback: If no member record, default contributions to 0
	const adminContributions =
		getTotalContributionsByMember(adminMemberId) || 0;
	const adminMaxLoanAmount = adminContributions * settings.maxLoanMultiplier;

	// Allow admin to apply for loan if they are found as a member and eligible
	const adminCanApplyForLoan =
		thisAdminMember?.canApplyForLoan && thisAdminMember?.loanEligible;

	// Check if member has pending loan application
	const hasPendingLoan = getLoanRequestsByMemberId(user.id).some(
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
									notifications={adminActivities}
									itemsPerPage={10}
									user={user}
									memberLoans={memberLoanActivities}
									contributions={memberContributionActivities}
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
										}}
										onCancel={() => setShowLoanModal(false)}
									/>
								)}

								{/* Recent Activity */}
								<AdminRecentActivity
									activities={adminActivities}
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
											size={16}
											className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
										/>
										{/* Custom input */}
										<Input
											className="pl-9 pr-8 h-9 py-[22px] rounded-md text-sm border-gray-300 focus-visible:ring-emerald-300"
											placeholder="Search by admin or type"
											value={searchTerm}
											onChange={(e) => {
												setSearchTerm(e.target.value);
											}}
										/>
										{/* Right icon: spinner or tick */}
										<div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 z-10">
											{searchStatus === "typing" ? (
												<svg
													className="animate-spin h-4 w-4 text-gray-400"
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													></circle>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
													></path>
												</svg>
											) : searchStatus === "done" ? (
												<Check
													size={16}
													className="text-emerald-600"
												/>
											) : null}
										</div>
									</div>
									{viewMode &&
										viewMode === "card" &&
										totalMembersPages > 1 && (
											<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 bg-white/90 flex-shrink-0">
												<div className="flex items-center gap-2 text-sm">
													<span className="text-gray-500">
														Per page:
													</span>
													<Select
														value={membersPerPage.toString()}
														onValueChange={(
															value
														) =>
															setMembersPerPage(
																Number(value)
															)
														}
													>
														<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[110px] hover:bg-blue-100 flex justify-center">
															<SelectValue />
														</SelectTrigger>
														<SelectContent side="top">
															{[
																"6",
																"12",
																"24",
																"48",
															].map((value) => (
																<SelectItem
																	key={value}
																	value={
																		value
																	}
																>
																	{value} /
																	page
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>

												<div className="text-sm text-gray-600 whitespace-nowrap">
													Showing{" "}
													{Math.min(
														(membersPage - 1) *
															membersPerPage +
															1,
														filteredMembers.length
													)}
													-
													{Math.min(
														membersPage *
															membersPerPage,
														filteredMembers.length
													)}{" "}
													of {filteredMembers.length}{" "}
													members
												</div>
											</div>
										)}
								</div>

								{/* Members Display */}
								{viewMode === "card" ? (
									<>
										<div className="flex flex-row flex-grow flex-wrap lg:justify-start sx:justify-center min-h-[400px] w-full">
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
																handleDeleteMember
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
												members={paginatedMembers}
												onView={setSelectedMember}
												onStatusToggle={
													toggleMemberStatus
												}
												onLoanToggle={
													toggleLoanEligibility
												}
												onDelete={handleDeleteMember}
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
									<AdminContributionsTable
										currentUser={thisAdminMember}
									/>
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
										updateSettings={updateSettings}
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
