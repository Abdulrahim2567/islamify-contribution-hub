import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CreditCard,
	CheckCircle,
	XCircle,
	Clock,
	User,
	DollarSign,
	Calendar,
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

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "pending":
				return <AnimatedClockIcon/>;
			case "approved":
				return <CheckCircle className="w-4 h-4" />;
			case "rejected":
				return <XCircle className="w-4 h-4" />;
			default:
				return<AnimatedClockIcon/>;
		}
	};

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

	const LoanCard = ({
		loan,
		showActions = false,
	}: {
		loan: LoanRequest;
		showActions?: boolean;
	}) => (
		<Card className="border border-gray-200 dark:border-gray-900 rounded-xl shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] flex flex-col min-w-[270px] md:max-w-[320px] animate-fade-in">
			<CardContent className="flex flex-col justify-between h-full p-4 space-y-4">
				{/* Section 1: Summary */}
				<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl">
					<div className="flex justify-between items-start">
						<div>
							<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300/80 mb-4 flex items-center gap-2">
								<User className="w-4 h-4 text-emerald-600" />
								{loan.memberName}
							</h3>
							<p className="text-lg font-bold text-gray-700 dark:text-gray-300/80">
								{formatCurrency(loan.amount)}
							</p>
						</div>
						<div className="flex flex-col items-end gap-1">
							<Badge
								className={`text-xs flex items-center gap-1 ${getStatusColor(
									loan.status
								)}`}
							>
								{getStatusIcon(loan.status)}
								{loan.status.charAt(0).toUpperCase() +
									loan.status.slice(1)}
							</Badge>
							<p className="text-xs text-gray-500 dark:text-gray-300/70 whitespace-nowrap mr-2">
								{formatDistanceToNow(
									new Date(loan.requestDate),
									{ addSuffix: true }
								).replace(/^about\s/, "")}
							</p>
						</div>
					</div>
				</div>

				{/* Section 2: Details */}
				<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl space-y-2">
					<p className="text-[12px] font-medium text-gray-600 dark:text-gray-400/60">
						Purpose:
					</p>
					<p className="text-[12px] text-gray-800 dark:text-gray-300/80 opacity-80 mb-3">
						{loan.purpose}
					</p>

					{loan.processedDate && (
						<p className="text-[12px] text-gray-700 dark:text-gray-300/80">
							<span className="font-medium text-gray-600 dark:text-gray-400/60">
								Processed on:
							</span>{" "}
							{new Date(loan.processedDate).toLocaleDateString()}{" "}
							by{" "}
							<span className="opacity-80">
								{loan.processedBy}
							</span>
						</p>
					)}
				</div>

				{/* Section 3: Actions */}
				{showActions && loan.status === "pending" && (
					<div className="flex gap-2 pt-2 mt-auto">
						<Button
							size="sm"
							variant="destructive"
							className="text-xs flex-1 flex items-center gap-1"
							onClick={() => handleReject?.(loan.id)}
						>
							<XCircle className="w-3 h-3" />
							Reject
						</Button>
						<Button
							size="sm"
							className="text-xs flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex items-center gap-1"
							onClick={() => handleApprove?.(loan.id)}
						>
							<CheckCircle className="w-3 h-3" />
							Approve
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
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
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
						<CreditCard className="w-6 h-6 text-white" />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
						Manage Loans
					</h1>
				</div>
				<p className="text-gray-600 ml-1 opacity-75">
					Review and manage member loan requests
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card className="animate-fade-in border-l-4 border-l-yellow-500">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Pending Requests
								</p>
								<p className="text-3xl font-bold text-yellow-600">
									{pendingRequests.length}
								</p>
							</div>
							<Clock className="w-8 h-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="animate-fade-in border-l-4 border-l-green-500">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Approved Loans
								</p>
								<p className="text-3xl font-bold text-green-600">
									{approvedRequests.length}
								</p>
							</div>
							<CheckCircle className="w-8 h-8 text-green-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="animate-fade-in border-l-4 border-l-red-500">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Rejected Requests
								</p>
								<p className="text-3xl font-bold text-red-600">
									{rejectedRequests.length}
								</p>
							</div>
							<XCircle className="w-8 h-8 text-red-600" />
						</div>
					</CardContent>
				</Card>
			</div>

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
							/>
						))
					) : (
						<EmptyState type="pending" />
					)}
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					{approvedRequests.length > 0 ? (
						approvedRequests.map((loan) => (
							<LoanCard key={loan.id} loan={loan} />
						))
					) : (
						<EmptyState type="approved" />
					)}
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					{rejectedRequests.length > 0 ? (
						rejectedRequests.map((loan) => (
							<LoanCard key={loan.id} loan={loan} />
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
