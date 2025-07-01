import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/calculations";
import React, { useState } from "react";
import AdminRecentActivity from "../dashboard/AdminRecentActivity";
import LoanApplication from "@/components/member/LoanApplication";
import { AnimatedClockIcon } from "@/components/ui/AnimatedClock";
import { CreditCard } from "lucide-react";
import AdminStatsCards from "../dashboard/AdminStatsCards";
import { AdminActivityLog, AppSettings, Member } from "@/types/types";
import { useContributions } from "@/hooks/useContributions";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import MemberContributionHistory from "@/components/member/MemberContributionHistory";
import MemberStatsCards from "@/components/member/MemberStatsCards";

interface DashboardProps {
	thisAdminMember: Member;
	members: Member[];
	settings: AppSettings;
	adminActivities: AdminActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({
	members,
	thisAdminMember,
	settings,
	adminActivities,
}) => {
	const { getTotalAllContributions, getTotalContributionsByMember } =
		useContributions();
	const { getLoanRequestsByMemberId } = useLoanRequests();
	const [showLoanModal, setShowLoanModal] = useState(false);

	const totalMembers = members.length;
	const activeMembers = members.filter((m) => m.isActive).length;
	const inactiveMembers = totalMembers - activeMembers;
	const totalContributions = getTotalAllContributions();
	const totalRegistrationFees = members.reduce(
		(sum, member) => sum + member.registrationFee,
		0
	);

	const adminContributions =
		getTotalContributionsByMember(thisAdminMember.id) || 0;
	const adminMaxLoanAmount = adminContributions * settings.maxLoanMultiplier;

	// Allow admin to apply for loan if they are found as a member and eligible
	const adminCanApplyForLoan =
		thisAdminMember?.canApplyForLoan && thisAdminMember?.loanEligible;
	// Check if member has pending loan application
	const hasPendingLoan = getLoanRequestsByMemberId(thisAdminMember.id).some(
		(loan) => loan.status === "pending"
	);

    const maxLoanAmount = adminContributions * settings.maxLoanMultiplier;


	return (
		<>
			{thisAdminMember.role === "admin" ? (
				// Stats Cards
				<AdminStatsCards
					totalMembers={totalMembers}
					activeMembers={activeMembers}
					inactiveMembers={inactiveMembers}
					totalContributions={totalContributions}
					totalRegistrationFees={totalRegistrationFees}
				/>
			) : (
				<MemberStatsCards
					totalContributions={adminContributions}
					maxLoanAmount={maxLoanAmount}
					settings={settings}
					registrationFee={thisAdminMember.registrationFee}
				/>
			)}

			{/* Allow admin to apply for a loan (just like member dashboard) */}
			{adminCanApplyForLoan && !hasPendingLoan && (
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
				<div className="flex justify-end mb-6 rounded-lg">
					<div className="bg-yellow-100 dark:bg-yellow-400/5 border border-yellow-300 dark:border-yellow-400/80 text-yellow-800 dark:text-yellow-300/80 px-6 py-3 rounded-[25px] font-medium flex items-center gap-2">
						<AnimatedClockIcon />
						Loan Application Pending
					</div>
				</div>
			)}
			{showLoanModal && (
				<LoanApplication
					open={showLoanModal}
					onOpenChange={setShowLoanModal}
					memberId={thisAdminMember.id.toString()}
					memberName={thisAdminMember.name}
					memberEmail={thisAdminMember.email}
					maxAmount={adminMaxLoanAmount}
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

			{/* Recent Activity */}
			{thisAdminMember.role === "admin" ? (
				<AdminRecentActivity activities={adminActivities} />
			) : (
				<MemberContributionHistory
					memberId={thisAdminMember.id}
					memberName={thisAdminMember.name}
				/>
			)}
		</>
	);
};

export default Dashboard;
