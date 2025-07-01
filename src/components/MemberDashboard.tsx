import { useState } from "react";
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
	Settings2Icon,
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

import { AppSettings, LoanRequest, Member } from "@/types/types";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { UserDropdown } from "./ui/UserDropdown";
import { NotificationDropdown } from "./ui/NotificationDropdown";

import { useContributions } from "@/hooks/useContributions";
import { useMembers } from "@/hooks/useMembers";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";
import { SettingsSidebar } from "./SettingsSidebar";
import { cn } from "@/lib/utils";
import { AnimatedClockIcon } from "./ui/AnimatedClock";
import MemberStatsCards from "./member/MemberStatsCards";
import MemberLoans from "./member/MemberLoans";

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
	const {
		getAllContributionsActivitiesForMember,
		getMemberLoanActivitiesByMember,
	} = useRecentActivities();
	const {
		getLoanRequestsByMemberId,
		getApprovedLoanRequests,
		getPendingLoanRequests,
		getRejectedLoanRequests,
	} = useLoanRequests();
	const { settings } = useIslamifySettings();
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState<string>("dashboard");
	const [showLoanModal, setShowLoanModal] = useState(false);

	// Load member's loans

	// Find current member record for up-to-date fields
	const thisMember = members.find((m) => m.id === user.id);
	const [settingsOpen, setSettingsOpen] = useState(false);

	// Fetch member's real contributions from localStorage recent activities

	const totalContributions = getTotalContributionsByMember(user.id);
	// Use settings for registration fee and loan multiplier
	const registrationFee = thisMember.registrationFee;
	const maxLoanAmount = totalContributions * settings.maxLoanMultiplier;
	const canApplyForLoan =
		thisMember?.canApplyForLoan && thisMember?.loanEligible;

	const memberLoans = getLoanRequestsByMemberId(thisMember.id);

	// Check if member has pending loan application
	const hasPendingLoan = memberLoans.some(
		(loan) => loan.status === "pending"
	);

	const pendingRequests = getPendingLoanRequests(user.id);
	const approvedRequests = getApprovedLoanRequests(user.id);
	const rejectedRequests = getRejectedLoanRequests(user.id);

	const memberLoanActivities = getMemberLoanActivitiesByMember(thisMember.id);
	const memberContributionActivities = getAllContributionsActivitiesForMember(
		thisMember.id
	);

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
			<CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-300/80 mx-auto mb-4" />
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-400/80 mb-2">
				No {type} loans
			</h3>
			<p className="text-gray-500 dark:text-gray-300/80">
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
					<CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-500/80 flex items-center gap-2">
						<User className="w-5 h-5 text-emerald-600 dark:text-emerald-400/80" />
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
						<DollarSign className="w-4 h-4 text-green-600 dark:text-green-300/80" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-300/80">
								Amount
							</p>
							<p className="font-semibold text-lg text-green-600">
								{formatCurrency(loan.amount)}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400/80" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-300/80">
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
					<p className="text-sm text-gray-600 dark:text-gray-300/80 mb-1">
						Purpose
					</p>
					<p className="text-gray-800 dark:text-gray-300/80 bg-background p-2 rounded-md">
						{loan.purpose}
					</p>
				</div>

				{loan.processedDate && (
					<div className="text-sm text-gray-600 dark:text-gray-300/80">
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
				return "bg-yellow-100 dark:bg-yellow-400/5 text-yellow-800 dark:text-yellow-300/80 border-yellow-200 dark:border-yellow-300/80";
			case "approved":
				return "bg-green-100 text-green-800 border-green-200 dark:bg-green-400/5 text-green-800 dark:text-green-300/80 dark:border-green-300/80";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-200 dark:bg-red-400/5 dark:text-red-300/80 dark:border-red-300/80";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-400/5 dark:text-gray-300/80 dark:border-gray-300/80";
		}
	};

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return (
					<div className="container mx-auto px-4 py-8">
						{/* Stats Cards */}
						<MemberStatsCards
							totalContributions={totalContributions}
							maxLoanAmount={maxLoanAmount}
							settings={settings}
							registrationFee={registrationFee}
						/>

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
								<div className="bg-yellow-100 dark:bg-yellow-400/5 border border-yellow-300 dark:border-yellow-400/80 text-yellow-800 dark:text-yellow-300/80 px-6 py-3 rounded-[25px] font-medium flex items-center gap-2">
									<AnimatedClockIcon /> Loan Application
									Pending
								</div>
							</div>
						)}

						{showLoanModal && (
							<LoanApplication
								open={showLoanModal}
								onOpenChange={setShowLoanModal}
								memberId={user.id.toString()}
								memberName={user.name}
								memberEmail={user.email}
								maxAmount={maxLoanAmount}
								maxLoanMultiplier={settings.maxLoanMultiplier}
								onSubmit={(data) => {
									toast({
										title: "Loan Application Submitted",
										description: `Your application for ${formatCurrency(
											data.amount
										)} is pending.`,
									});
								}}
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
					<MemberLoans
						memberLoans={memberLoans}
						pendingRequests={pendingRequests}
						approvedRequests={approvedRequests}
						rejectedRequests={rejectedRequests}
					/>
				);
			case "members":
				return <MembersPage currentUser={user} />;
			default:
				return null;
		}
	};

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-background">
				<AppSidebar
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onLogout={onLogout}
					user={user}
				/>
				<SidebarInset>
					<div className="min-h-screen">
						{/* Header */}
						<div className="sticky top-0 z-50 bg-background/50 border-b border-gray-200 dark:border-gray-900 px-6 py-4 backdrop-blur">
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
											<p className="text-sm text-gray-600 dark:text-gray-300/80">
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
									<button
										onClick={() => setSettingsOpen(true)}
										className="ml-2 p-2 text-gray-500 hover:text-gray-700"
									>
										<Settings2Icon />
									</button>
								</div>
							</div>
							<SettingsSidebar
								open={settingsOpen}
								onOpenChange={setSettingsOpen}
								settings={settings}
								user={user}
								updateSettings={() => {}}
							/>
						</div>
						{renderContent()}
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default MemberDashboard;
