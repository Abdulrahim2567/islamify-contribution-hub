import { useState } from "react";
import { CreditCard, User, Settings2Icon } from "lucide-react";
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
import { UserDropdown } from "./user-dropdown/UserDropdown";
import { NotificationDropdown } from "./notifications/NotificationDropdown";

import { useContributions } from "@/hooks/useContributions";
import { useMembers } from "@/hooks/useMembers";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";
import { SettingsSidebar } from "./SettingsSidebar";
import { AnimatedClockIcon } from "./ui/AnimatedClock";
import MemberStatsCards from "./member/MemberStatsCards";
import MemberLoans from "./common/MemberLoans";
import { Member } from "@/types/types";
import Contributions from "./admin/tabs/Contributions";
import LoanStatsCards from "./common/LoanStatsCards";

interface MemberDashboardProps {
	user: Member;
	onLogout: () => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({
	user,
	onLogout,
}) => {
	const { getTotalContributionsByMember } = useContributions();
	const { members, updateMember } = useMembers();
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
					<>
						<div className="ml-6 mt-4">
							<div className="flex items-center gap-3 mb-2 ">
								<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
									<CreditCard className="w-6 h-6 text-white" />
								</div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent ">
									My Loan Applications
								</h1>
							</div>
							<p className="text-gray-600 dark:text-gray-300/80 text-sm mt-3 ml-14">
								Track your loan application status
							</p>
						</div>
						<div className="px-5 mt-3">
							<LoanStatsCards
								pendingRequests={pendingRequests}
								approvedRequests={approvedRequests}
								rejectedRequests={rejectedRequests}
							/>
							<MemberLoans
								memberLoans={memberLoans}
								pendingRequests={pendingRequests}
								approvedRequests={approvedRequests}
								rejectedRequests={rejectedRequests}
							/>
						</div>
					</>
				);
			case "members":
				return <MembersPage currentUser={user} />;
			case "contributions":
				return (
					<div className="mx-auto px-6 py-8">
						<Contributions thisMember={user} />
					</div>
				);
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
										onUpdateReadNotifications={updateMember}
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
