import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	TrendingUp,
	CreditCard,
	Clock,
	CheckCircle,
	XCircle,
	Calendar,
	DollarSign,
	User,
} from "lucide-react";
import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import MembersPage from "./member/MembersPage";
import { useToast } from "@/hooks/use-toast";
import MemberContributionHistory from "./member/MemberContributionHistory";
import LoanApplication from "./member/LoanApplication";
import { formatCurrency } from "../utils/calculations";
import {
	getSettings,
	AppSettings,
	initializeSettings,
} from "../utils/settingsStorage";

import {
	ContributionRecordActivity,
	LoanRequest,
	Member,
	MemberLoanActivity,
} from "@/types/types";
import {
	getApprovedLoanRequests,
	getLoanRequestsByMemberId,
	getPendingLoanRequests,
	getRejectedLoanRequests,
} from "@/utils/loanStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserDropdown } from "./ui/UserDropdown";
import { NotificationDropdown } from "./ui/NotificationDropdown";
import {
	getAllContributionsActivitiesForMember,
	getMemberLoanActivitiesByMember,
} from "@/utils/recentActivities";

import { useContributions } from "@/hooks/useContributions";
import { useMembers } from "@/hooks/useMembers";

interface MemberDashboardProps {
	user: Member;
	onLogout: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({
	user,
	onLogout,
}) => {
	const { getTotalContributionsByMember } = useContributions();
	const { members } = useMembers();
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState<string>("dashboard");
	const [showLoanModal, setShowLoanModal] = useState(false);
	const [memberLoans, setMemberLoans] = useState<LoanRequest[]>([]);
	const [settings, setSettings] = useState<AppSettings>(getSettings());

	// Store all activities for this member (contributions history)
	const [memberContributionActivities, setMemberContributionActivities] =
		useState<ContributionRecordActivity[]>();
	const [memberLoanActivities, setMemberLoanActivities] =
		useState<MemberLoanActivity[]>();

	useEffect(() => {
		setMemberContributionActivities(
			getAllContributionsActivitiesForMember(user.id)
		);
		setMemberLoanActivities(getMemberLoanActivitiesByMember(user.id));
	}, []);

	// Listen for settings changes
	useEffect(() => {
		const handleSettingsChange = (event: CustomEvent) => {
			setSettings(event.detail);
		};

		window.addEventListener(
			"settingsChanged",
			handleSettingsChange as EventListener
		);
		return () => {
			window.removeEventListener(
				"settingsChanged",
				handleSettingsChange as EventListener
			);
		};
	}, []);

	// Load member's loans
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

	// Find current member record for up-to-date fields
	const thisMember = members.find((m) => m.id === user.id);

	// Fetch member's real contributions from localStorage recent activities

	const totalContributions = getTotalContributionsByMember(user.id);
	// Use settings for registration fee and loan multiplier
	const registrationFee = thisMember.registrationFee;
	const maxLoanAmount = totalContributions * settings.maxLoanMultiplier;
	const canApplyForLoan =
		thisMember?.canApplyForLoan && thisMember?.loanEligible;

	// Check if member has pending loan application
	const hasPendingLoan = memberLoans.some(
		(loan) => loan.status === "pending"
	);

	const pendingRequests = getPendingLoanRequests(user.id);
	const approvedRequests = getApprovedLoanRequests(user.id);
	const rejectedRequests = getRejectedLoanRequests(user.id);

	// ... keep existing code (getStatusIcon and getStatusColor functions)

	const getStatusIcon = (status) => {
		switch (status) {
			case "pending":
				return <Clock className="w-4 h-4" />;
			case "approved":
				return <CheckCircle className="w-4 h-4" />;
			case "rejected":
				return <XCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const EmptyState = ({ type }: { type: string }) => (
		<div className="text-center py-12 animate-fade-in">
			<CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
			<h3 className="text-lg font-medium text-gray-900 mb-2">
				No {type} loans
			</h3>
			<p className="text-gray-500">
				{type === "pending" &&
					"No loan requests are waiting for approval."}
				{type === "approved" && "No loans have been approved yet."}
				{type === "rejected" && "No loan requests have been rejected."}
			</p>
		</div>
	);

	const LoanCard = ({ loan }: { loan: LoanRequest }) => (
		<Card className="animate-fade-in hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
						<User className="w-5 h-5 text-emerald-600" />
						{loan.memberName}
					</CardTitle>
					<Badge
						className={`flex items-center gap-1 ${getStatusColor(
							loan.status
						)}`}
					>
						{getStatusIcon(loan.status)}
						{loan.status.charAt(0).toUpperCase() +
							loan.status.slice(1)}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex items-center gap-2">
						<DollarSign className="w-4 h-4 text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Amount</p>
							<p className="font-semibold text-lg text-green-600">
								{formatCurrency(loan.amount)}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">
								Request Date
							</p>
							<p className="font-medium">
								{new Date(
									loan.requestDate
								).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>

				<div>
					<p className="text-sm text-gray-600 mb-1">Purpose</p>
					<p className="text-gray-800 bg-gray-50 p-2 rounded-md">
						{loan.purpose}
					</p>
				</div>

				{loan.processedDate && (
					<div className="text-sm text-gray-600">
						Processed on{" "}
						{new Date(loan.processedDate).toLocaleDateString()} by{" "}
						{loan.processedBy}
					</div>
				)}
			</CardContent>
		</Card>
	);

	const getStatusColor = (status) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "approved":
				return "bg-green-100 text-green-800 border-green-200";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return (
					<div className="container mx-auto px-4 py-8">
						{/* Admin Notice */}
						{user.role === "admin" && (
							<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-blue-800 font-medium">
									👑 Admin View: You're viewing your personal
									member data. Your admin privileges are
									maintained.
								</p>
							</div>
						)}

						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
							<Card className="animate-fade-in">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">
												Total Contributions
											</p>
											<p className="text-3xl font-bold text-blue-600">
												{formatCurrency(
													totalContributions
												)}
											</p>
										</div>
										<TrendingUp className="w-8 h-8 text-blue-600" />
									</div>
								</CardContent>
							</Card>

							<Card className="animate-fade-in">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">
												Max Loan Amount
											</p>
											<p className="text-3xl font-bold text-green-600">
												{formatCurrency(maxLoanAmount)}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												{settings.maxLoanMultiplier}×
												your contributions
											</p>
										</div>
										<CreditCard className="w-8 h-8 text-green-600" />
									</div>
								</CardContent>
							</Card>

							<Card className="animate-fade-in">
								<CardContent className="p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-gray-600">
												Registration Fee
											</p>
											<p className="text-3xl font-bold text-purple-600">
												{formatCurrency(registrationFee)}
											</p>
											<Badge
												variant="outline"
												className="mt-2 text-green-600 border-green-600"
											>
												✓ Paid
											</Badge>
										</div>
										<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
											<span className="text-purple-600 font-bold">
												₣
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{canApplyForLoan && !hasPendingLoan && (
							<div className="flex justify-end mb-6">
								<button
									className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all"
									onClick={() => setShowLoanModal(true)}
								>
									<CreditCard className="w-5 h-5" />
									Apply For Loan
								</button>
							</div>
						)}

						{hasPendingLoan && (
							<div className="flex justify-end mb-6">
								<div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-[25px] font-medium flex items-center gap-2">
									<Clock className="w-5 h-5" />
									Loan Application Pending
								</div>
							</div>
						)}

						{showLoanModal && (
							<LoanApplication
								memberId={user.id.toString()}
								memberName={user.name}
								memberEmail={user.email}
								maxAmount={maxLoanAmount}
								maxLoanMultiplier={settings.maxLoanMultiplier}
								onSubmit={(data) => {
									setShowLoanModal(false);
									toast({
										title: "Loan Application Submitted",
										description: `Your application for ${formatCurrency(
											data.amount
										)} is pending.`,
									});
									// Reload loans to show the new application
									const userLoans = getLoanRequestsByMemberId(
										user.id
									);
									if (userLoans) {
										setMemberLoans(userLoans);
									}
								}}
								onCancel={() => setShowLoanModal(false)}
							/>
						)}

						{/* Contribution History */}
						<div className="mt-8">
							<MemberContributionHistory
								memberId={user.id}
								memberName={user.name}
							/>
						</div>
					</div>
				);
			case "loans":
				return (
					<div className="container mx-auto px-4 py-8">
						<div className="max-w-6xl mx-auto px-4 py-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								My Loan Applications
							</h1>
							<p className="text-gray-600">
								Track your loan application status
							</p>
						</div>

						{memberLoans.length === 0 ? (
							<div className="text-center py-12">
								<CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No loan applications
								</h3>
								<p className="text-gray-500">
									You haven't applied for any loans yet.
								</p>
							</div>
						) : (
							<div className="space-y-6">
								{memberLoans.map((loan) => (
									<div className="max-w-6xl mx-auto px-4 py-8">
										<Tabs
											defaultValue="requests"
											className="w-full"
										>
											<TabsList className="grid w-full grid-cols-3 mb-6">
												<TabsTrigger
													value="requests"
													className="flex items-center gap-2"
													color="yellow"
												>
													<Clock className="w-4 h-4" />
													Requests (
													{pendingRequests.length})
												</TabsTrigger>
												<TabsTrigger
													value="approved"
													className="flex items-center gap-2"
													color="green"
												>
													<CheckCircle className="w-4 h-4" />
													Approved (
													{approvedRequests.length})
												</TabsTrigger>
												<TabsTrigger
													value="rejected"
													className="flex items-center gap-2"
													color="red"
												>
													<XCircle className="w-4 h-4" />
													Rejected (
													{rejectedRequests.length})
												</TabsTrigger>
											</TabsList>

											<TabsContent
												value="requests"
												className="space-y-4"
											>
												{pendingRequests.length > 0 ? (
													pendingRequests.map(
														(loan) => (
															<LoanCard
																key={loan.id}
																loan={loan}
															/>
														)
													)
												) : (
													<EmptyState type="pending" />
												)}
											</TabsContent>

											<TabsContent
												value="approved"
												className="space-y-4"
											>
												{approvedRequests.length > 0 ? (
													approvedRequests.map(
														(loan) => (
															<LoanCard
																key={loan.id}
																loan={loan}
															/>
														)
													)
												) : (
													<EmptyState type="approved" />
												)}
											</TabsContent>

											<TabsContent
												value="rejected"
												className="space-y-4"
											>
												{rejectedRequests.length > 0 ? (
													rejectedRequests.map(
														(loan) => (
															<LoanCard
																key={loan.id}
																loan={loan}
															/>
														)
													)
												) : (
													<EmptyState type="rejected" />
												)}
											</TabsContent>
										</Tabs>
									</div>
								))}
							</div>
						)}
					</div>
				);
			case "members":
				return <MembersPage currentUser={user} />;
			default:
				return null;
		}
	};

	useEffect(() => {
		initializeSettings();
	}, []);

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
					<div className="min-h-screen">
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
									<UserDropdown
										user={user}
										onLogout={onLogout}
									/>
									<NotificationDropdown
										memberLoans={memberLoanActivities}
										contributions={
											memberContributionActivities
										}
										itemsPerPage={10}
										user={user}
										notifications={[]}
									/>
								</div>
							</div>
						</div>
						{renderContent()}
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default MemberDashboard;
