import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CreditCard,
	CheckCircle,
	XCircle,
	Clock,
	Coins,
	User2Icon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getNowString } from "@/utils/calculations";
import {
	AdminActivityLog,
	LoanRequest,
	Member,
	MemberLoanActivity,
} from "@/types/types";

import { useLoanRequests } from "@/hooks/useLoanRequests";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AnimatedClockIcon } from "@/components/ui/AnimatedClock";
import LoanCard from "../../common/LoanCard";
import LoanStatsCards from "@/components/common/LoanStatsCards";

interface LoanRequest_ extends LoanRequest {
	adminNotes?: string;
}

//Member as LoanManagementProps
interface LoanManagementProps {
	user: Member;
}

const LoanManagement = ({ user }: LoanManagementProps) => {
	const { saveLoanActivity, saveAdminActivity } = useRecentActivities();
	const { loanRequests, updateLoanRequest } = useLoanRequests();
	const { toast } = useToast();

	const handleApprove = (loanId: string) => {
		const loan = loanRequests.find((l) => l.id === loanId);
		if (!loan) return;

		// Save updated requests
		updateLoanRequest(loanId, {
			...loan,
			status: "approved",
			processedDate: getNowString(),
			processedBy: user.name,
		});

		// Add to admin activities

		const adminLoanActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "loan_approved",
			text: `Approved loan of ${formatCurrency(loan.amount)} for "${
				loan.memberName
			}"`,
			color: "green",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
		};

		// Save admin activity
		saveAdminActivity(adminLoanActivity);

		const memberLoanActivity: MemberLoanActivity = {
			type: "loan_approval",
			amount: loan.amount,
			memberId: loan.memberId,
			memberName: loan.memberName,
			date: getNowString(),
			performedBy: user.name,
			description: `Your loan application for ${formatCurrency(
				loan.amount
			)} has been approved. The funds will be processed shortly.`,
		};

		// Add to member activities
		saveLoanActivity(memberLoanActivity);
	};

	const handleReject = (loanId: string) => {
		const loan = loanRequests.find((l) => l.id === loanId);
		if (!loan) return;

		updateLoanRequest(loanId, {
			...loan,
			status: "rejected",
			processedDate: getNowString(),
			processedBy: user.name,
		});

		// Create admin activity
		const adminActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "loan_rejected",
			text: `Rejected loan request of ${formatCurrency(
				loan.amount
			)} for "${loan.memberName}"`,
			color: "red",
			adminName: user.name,
			adminEmail: user.email,
			adminRole: user.role,
		};
		// Save admin activity
		saveAdminActivity(adminActivity);

		// Create member activity
		const memberActivity: MemberLoanActivity = {
			type: "loan_rejection",
			amount: loan.amount,
			memberId: loan.memberId,
			memberName: loan.memberName,
			date: getNowString(),
			performedBy: user.name,
			description: `Your loan application for ${formatCurrency(
				loan.amount
			)} has been reviewed and unfortunately could not be approved at this time. Please contact the admin for more details.`,
		};

		// Save member activity
		saveLoanActivity(memberActivity);
	};

	const pendingRequests = loanRequests.filter(
		(loan) => loan.status === "pending"
	);
	const approvedRequests = loanRequests.filter(
		(loan) => loan.status === "approved"
	);
	const rejectedRequests = loanRequests.filter(
		(loan) => loan.status === "rejected"
	);

	const EmptyState = ({ type }: { type: string }) => (
		<div className="text-center py-12 animate-fade-in">
			<CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
			<h3 className="text-lg font-medium text-gray-900 dark:text-gray-300/80 mb-2">
				No {type} loans
			</h3>
			<p className="text-gray-500 dark:text-gray-200/80 opacity-70">
				{type === "pending" &&
					"No loan requests are waiting for approval."}
				{type === "approved" && "No loans have been approved yet."}
				{type === "rejected" && "No loan requests have been rejected."}
			</p>
		</div>
	);

	return (
		<div className="mx-auto">
			{/* Stats Cards */}
			<LoanStatsCards
				pendingRequests={pendingRequests}
				approvedRequests={approvedRequests}
				rejectedRequests={rejectedRequests}
			/>

			{/* Loan Requests Tabs */}
			<Tabs defaultValue="requests" className="w-full bg-background">
				<TabsList className="grid w-full grid-cols-3 mb-6 dark:bg-blue-400/5 rounded-full">
					<TabsTrigger
						value="requests"
						className={cn(
							"rounded-md text-center flex items-center gap-2",
							"dark:data-[state=active]:bg-yellow-400/20 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-600/90",
							"transition-colors"
						)}
					>
						<Clock className="w-4 h-4" />
						Requests ({pendingRequests.length})
					</TabsTrigger>
					<TabsTrigger
						value="approved"
						className={cn(
							"rounded-md text-center flex items-center gap-2",
							"dark:data-[state=active]:bg-emerald-400/20 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-600/90",
							"transition-colors"
						)}
					>
						<CheckCircle className="w-4 h-4" />
						Approved ({approvedRequests.length})
					</TabsTrigger>
					<TabsTrigger
						value="rejected"
						className={cn(
							"rounded-md text-center flex items-center gap-2",
							"dark:data-[state=active]:bg-red-400/20 data-[state=active]:bg-red-100 data-[state=active]:text-red-600/90",
							"transition-colors"
						)}
					>
						<XCircle className="w-4 h-4" />
						Rejected ({rejectedRequests.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="requests" className="space-y-4">
					{pendingRequests.length > 0 ? (
						pendingRequests.map((loan) => (
							<LoanCard
								key={loan.id}
								loan={loan}
								showActions={true}
								handleReject={handleReject}
								handleApprove={handleApprove}
							/>
						))
					) : (
						<EmptyState type="pending" />
					)}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{approvedRequests.length > 0 ? (
						approvedRequests.map((loan) => (
							<LoanCard
								key={loan.id}
								loan={loan}
								showActions={false}
								handleReject={handleReject}
								handleApprove={handleApprove}
							/>
						))
					) : (
						<EmptyState type="approved" />
					)}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{rejectedRequests.length > 0 ? (
						rejectedRequests.map((loan) => (
							<LoanCard
								key={loan.id}
								loan={loan}
								showActions={false}
								handleReject={handleReject}
								handleApprove={handleApprove}
							/>
						))
					) : (
						<EmptyState type="rejected" />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default LoanManagement;
