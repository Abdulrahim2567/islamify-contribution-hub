import { Member } from "@/types/types";
import React, { useState } from "react";
import LoanManagement from "../loan-management/LoanManagement";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import MemberLoans from "@/components/common/MemberLoans";
import { CreditCard, Shield, User } from "lucide-react";
import LoanStatsCards from "@/components/common/LoanStatsCards";
interface LoanProps {
	user: Member;
}
const Loan: React.FC<LoanProps> = ({ user }) => {
	const [tab, setTab] = useState<"all" | "mine">("mine");
	const {
		getPendingLoanRequests,
		getApprovedLoanRequests,
		getRejectedLoanRequests,
		getLoanRequestsByMemberId,
	} = useLoanRequests();

	const pendingRequests = getPendingLoanRequests(user.id);
	const approvedRequests = getApprovedLoanRequests(user.id);
	const rejectedRequests = getRejectedLoanRequests(user.id);
	const memberLoans = getLoanRequestsByMemberId(user.id);
	return (
		<>
			{user.role === "admin" ? (
				<>
					{tab === "mine" ? (
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-2 ">
								<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
									<CreditCard className="w-6 h-6 text-white" />
								</div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent ">
									My Loan Applications
								</h1>
							</div>
							<p className="text-gray-600 ml-14 dark:text-gray-300/80 text-sm mt-3">
								Track your loan application status
							</p>
						</div>
					) : (
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-2">
								<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
									<CreditCard className="w-6 h-6 text-white" />
								</div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
									Manage Loan Applications
								</h1>
							</div>
							<p className="text-gray-600 ml-14 dark:text-gray-300/80 text-sm mt-3">
								Review and manage member loan requests
							</p>
						</div>
					)}
					<div className="flex gap-2 mb-6">
						<button
							className={`px-4 py-2 rounded text-sm flex justify-center items-center ${
								tab === "mine"
									? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:bg-blue-400/5 text-gray-600 dark:text-blue-300/80"
									: "bg-background border border-gray-600 dark:border-gray-900 dark:text-gray-300/80 dark:hover:bg-blue-400/5"
							}`}
							onClick={() => setTab("mine")}
						>
							<User size={15} className="mr-2 mt-[1px]" />
							My Loan Requests
						</button>
						<button
							className={`px-4 py-2 rounded text-sm flex justify-center items-center ${
								tab === "all"
									? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white dark:bg-blue-400/5 text-gray-600 dark:text-blue-300/80"
									: "bg-background border border-gray-600 dark:border-gray-900 dark:text-gray-300/80 dark:hover:bg-blue-400/5"
							}`}
							onClick={() => setTab("all")}
						>
							<Shield size={15} className="mr-2 mt-[1px]" />
							Manage Loan Requests
						</button>
					</div>

					{tab === "mine" ? (
						<>
							{/* Stats Cards */}
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
						</>
					) : (
						<LoanManagement user={user} />
					)}
				</>
			) : (
				<>
					<div className="mb-8">
						<div className="flex items-center gap-3 mb-2 ">
							<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
								<CreditCard className="w-6 h-6 text-white" />
							</div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent ">
								My Loan Applications
							</h1>
						</div>
						<p className="text-gray-600 ml-14 dark:text-gray-300/80 text-sm mt-3">
							Track your loan application status
						</p>
					</div>
					{/* Stats Cards */}
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
				</>
			)}
		</>
	);
};

export default Loan;
