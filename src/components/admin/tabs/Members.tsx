import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Check, DollarSign, Grid, List, Search, User } from "lucide-react";
import RegisterMemberDialog from "../member/RegisterMemberDialog";
import AddContributionStepper from "../contribution/AddContributionStepper";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import MemberCard from "../../common/MemberCard";
import MemberTable from "../../common/MemberTable";
import {
	AdminActivityLog,
	AppSettings,
	Contribution,
	ContributionRecordActivity,
	Member,
} from "@/types/types";
import { formatCurrency, getNowString } from "@/utils/calculations";
import { useContributions } from "@/hooks/useContributions";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import React, { useEffect, useState } from "react";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import { useMembers } from "@/hooks/useMembers";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from "../member/SuccessModal";
import MemberDetailModal from "../../common/MemberDetailModal";

// Add this type for the new member state
type NewMember = {
	name: string;
	email: string;
	phone: string;
	role: "member" | "admin";
};

interface MemberProps {
	user: Member;
	settings: AppSettings;
	members: Member[];
}

const Members: React.FC<MemberProps> = ({ user, settings, members }) => {
	const { addMember, updateMember, deleteMember } = useMembers();
	const {
		addMemberContribution,
		getTotalContributionsByMember,
		deleteAllMemberContributions,
	} = useContributions();
	const { getLoanRequestsByMemberId } = useLoanRequests();
	const { saveAdminActivity, saveContributionActivity } =
		useRecentActivities();
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
	const filteredMembers = members.filter((member) => {
		const role = member.role?.toString().toLowerCase() || "";
		const name = member.name?.toLowerCase() || "";
		const email = member.email?.toLowerCase() || "";
		const term = searchTerm.toLowerCase();

		return (
			role.includes(term) || name.includes(term) || email.includes(term)
		);
	});

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
			color: "lime",
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
		const member = members.find((m) => m.id === memberId);
		member.role = newRole;
		updateMember(member.id, member);

		// 💡 If the changed member is the logged-in user, update their localStorage too
		const loggedInUser = JSON.parse(
			localStorage.getItem("islamify_logged_in_user") || "{}"
		);
		if (loggedInUser.id === memberId) {
			const updatedUser = {
				...loggedInUser,
				role: newRole,
			};
			localStorage.setItem(
				"islamify_logged_in_user",
				JSON.stringify(updatedUser)
			);
		}

		// Log the activity
		const roleChangeActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "change_role",
			text: `Changed role for "${member.name}" (${member.email}) to ${newRole}`,
			color: "purple",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
			memberId: member.id,
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

	// For admin, find "self" as a member record, e.g., by email
	const thisAdminMember = members.find(
		(m) => m.email === user.email || m.id === user.id
	);

	// For loan, use sum of admin's contributions (like member dashboard logic)
	const adminMemberId = thisAdminMember?.id ?? user.id;

	return (
		<>
			{/* Header Section */}
			<div className="mb-8 flex justify-between items-center">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
							<User className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
							Manage Members
						</h1>
					</div>
					<p className="text-gray-600 ml-1 opacity-75">
						Manage association members and their contributions
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<button
							onClick={() => {
								setViewMode("table");
								setCardsShouldAnimate(false);
							}}
							className={`p-2 rounded-lg ${
								viewMode === "table"
									? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/5 dark:text-emerald-300/80"
									: "text-gray-400 hover:text-gray-600 dark:text-gray-300/80 dark:hover:text-gray-500/80"
							}`}
						>
							<List size={20} />
						</button>
						<button
							onClick={() => {
								setViewMode("card");
								setCardsShouldAnimate(true);
								setTimeout(
									() => setCardsShouldAnimate(false),
									700
								);
							}}
							className={`p-2 rounded-lg ${
								viewMode === "card"
									? "bg-emerald-100 text-emerald-600 dark:bg-emerald-400/5 dark:text-emerald-300/80"
									: "text-gray-400 hover:text-gray-600 dark:text-gray-300/80 dark:hover:text-gray-500/80"
							}`}
						>
							<Grid size={20} />
						</button>
					</div>
					{/* Add Contribution Button (opens stepper) */}
					{user.role === "admin" && (
						<button
							className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
							onClick={() => setShowAddContributionStepper(true)}
							type="button"
							aria-label="Add contribution"
						>
							<DollarSign size={20} />
							Add Contribution
						</button>
					)}
					{user.role === "admin" && (
						<RegisterMemberDialog
							open={showRegisterModal}
							registrationFee={settings.registrationFee}
							onOpenChange={setShowRegisterModal}
							newMember={newMember}
							setNewMember={setNewMember}
							onSubmit={handleRegisterMember}
						/>
					)}
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
						className="pl-9 pr-8 h-9 py-[22px] rounded-md text-sm border-gray-300 dark:border-gray-900 focus-visible:ring-emerald-300"
						placeholder="Search by name or email"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					{/* Right icon: spinner or tick */}
					<div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 z-10">
						{searchStatus === "typing" ? (
							<svg
								className="animate-spin h-4 w-4 text-blue-400"
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
							<Check size={16} className="text-emerald-600" />
						) : null}
					</div>
				</div>
				{viewMode && viewMode === "card" && totalMembersPages > 1 && (
					<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 bg-white/90 flex-shrink-0">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-500">Per page:</span>
							<Select
								value={membersPerPage.toString()}
								onValueChange={(value) =>
									setMembersPerPage(Number(value))
								}
							>
								<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[110px] hover:bg-blue-100 flex justify-center">
									<SelectValue />
								</SelectTrigger>
								<SelectContent side="top">
									{["6", "12", "24", "48"].map((value) => (
										<SelectItem key={value} value={value}>
											{value} / page
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="text-sm text-gray-600 whitespace-nowrap">
							Showing{" "}
							{Math.min(
								(membersPage - 1) * membersPerPage + 1,
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
				)}
			</div>

			{/* Members Display */}
			{viewMode === "card" ? (
				<>
					<div className="flex flex-row flex-grow flex-wrap lg:justify-start sx:justify-center min-h-[400px] w-full">
						{paginatedMembers.map((member, idx) => (
							<div
								key={member.id}
								className={
									cardsShouldAnimate
										? "animate-fade-in animate-scale-in"
										: ""
								}
								style={{
									animationDelay: cardsShouldAnimate
										? idx * 70 + "ms"
										: undefined,
									animationFillMode: cardsShouldAnimate
										? "both"
										: undefined,
								}}
							>
								<MemberCard
									member={member}
									currentUser={user}
									onView={setSelectedMember}
									onStatusToggle={toggleMemberStatus}
									onLoanToggle={toggleLoanEligibility}
									onDelete={handleDeleteMember}
									onRoleChange={handleChangeRole}
									onEdit={handleEditMember}
								/>
							</div>
						))}
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
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage - 1
													);
													setCardsShouldAnimate(true);
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
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														page
													);
													setCardsShouldAnimate(true);
													setTimeout(
														() =>
															setCardsShouldAnimate(
																false
															),
														700
													);
												}}
												isActive={page === membersPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									{membersPage < totalMembersPages && (
										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage + 1
													);
													setCardsShouldAnimate(true);
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
							currentUser={thisAdminMember}
							onView={setSelectedMember}
							onStatusToggle={toggleMemberStatus}
							onLoanToggle={toggleLoanEligibility}
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
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage - 1
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
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														page
													);
												}}
												isActive={page === membersPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									{membersPage < totalMembersPages && (
										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage + 1
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
			{/* Member Detail Modal - Add this inside SidebarInset but outside the main content */}
			{selectedMember && (
				<MemberDetailModal
					member={selectedMember}
					onClose={() => setSelectedMember(null)}
				/>
			)}
			{/* Success Modal - moved outside SidebarInset to ensure proper rendering */}
			<SuccessModal
				open={showSuccessModal}
				onOpenChange={setShowSuccessModal}
				generatedPassword={generatedPassword}
			/>
		</>
	);
};

export default Members;
