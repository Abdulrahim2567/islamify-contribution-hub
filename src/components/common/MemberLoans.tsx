import {
	Badge,
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	DollarSign,
	User,
	XCircle,
} from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { cn, formatWithOrdinal } from "@/lib/utils";
import { LoanRequest } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrency } from "@/utils/calculations";
import LoanCard from "./LoanCard";

interface MemberLoansProps {
	memberLoans: LoanRequest[];
	pendingRequests: LoanRequest[];
	approvedRequests: LoanRequest[];
	rejectedRequests: LoanRequest[];
}

const MemberLoans: React.FC<MemberLoansProps> = ({
	memberLoans,
	pendingRequests,
	approvedRequests,
	rejectedRequests,
}) => {
	return (
		<div className="mb-6">
			{memberLoans.length === 0 ? (
				<div className="text-center py-10">
					<CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-300/80 mx-auto mb-4" />
					<h3 className="text-lg font-medium text-gray dark:text-gray-300/80-900 mb-2">
						No loan applications
					</h3>
					<p className="text-gray-500 dark:text-gray-400/70">
						You haven't applied for any loans yet.
					</p>
				</div>
			) : (
				<div>
					{memberLoans.map((loan) => (
						<div className="mx-auto">
							<Tabs defaultValue="requests" className="w-full">
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

								<TabsContent
									value="requests"
									className="space-y-4"
								>
									{pendingRequests.length > 0 ? (
										pendingRequests.map((loan) => (
											<LoanCard
												key={loan._id}
												loan={loan}
												showActions={false}
												handleApprove={() => {}}
												handleReject={() => {}}
											/>
										))
									) : (
										<EmptyState type="pending" />
									)}
								</TabsContent>

								<TabsContent
									value="approved"
									className="space-y-4"
								>
									{approvedRequests.length > 0 ? (
										approvedRequests.map((loan) => (
											<LoanCard
												key={loan._id}
												loan={loan}
												showActions={false}
												handleApprove={() => {}}
												handleReject={() => {}}
											/>
										))
									) : (
										<EmptyState type="approved" />
									)}
								</TabsContent>

								<TabsContent
									value="rejected"
									className="space-y-4"
								>
									{rejectedRequests.length > 0 ? (
										rejectedRequests.map((loan) => (
											<LoanCard
												key={loan._id}
												loan={loan}
												showActions={false}
												handleApprove={() => {}}
												handleReject={() => {}}
											/>
										))
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
};

export default MemberLoans;

const EmptyState = ({ type }: { type: string }) => (
	<div className="text-center py-12 animate-fade-in">
		<CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-300/80 mx-auto mb-4" />
		<h3 className="text-lg font-medium text-gray-900 dark:text-gray-400/80 mb-2">
			No {type} loans
		</h3>
		<p className="text-gray-500 dark:text-gray-300/80">
			{type === "pending" && "No loan requests are waiting for approval."}
			{type === "approved" && "No loans have been approved yet."}
			{type === "rejected" && "No loan requests have been rejected."}
		</p>
	</div>
);
// 	<Card className="animate-fade-in hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
// 		<CardHeader className="pb-3">
// 			<div className="flex items-center justify-between">
// 				<CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-500/80 flex items-center gap-2">
// 					<User className="w-5 h-5 text-emerald-600 dark:text-emerald-400/80" />
// 					{loan.memberName}
// 				</CardTitle>
// 				<Badge
// 					className={`flex items-center gap-1 ${getStatusColor(
// 						loan.status
// 					)}`}
// 				>
// 					{getStatusIcon(loan.status)}
// 					{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
// 				</Badge>
// 			</div>
// 		</CardHeader>
// 		<CardContent className="space-y-4">
// 			<div className="grid grid-cols-2 gap-4">
// 				<div className="flex items-center gap-2">
// 					<DollarSign className="w-4 h-4 text-green-600 dark:text-green-300/80" />
// 					<div>
// 						<p className="text-sm text-gray-600 dark:text-gray-300/80">
// 							Amount
// 						</p>
// 						<p className="font-semibold text-lg text-green-600">
// 							{formatCurrency(loan.amount)}
// 						</p>
// 					</div>
// 				</div>
// 				<div className="flex items-center gap-2">
// 					<Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400/80" />
// 					<div>
// 						<p className="text-sm text-gray-600 dark:text-gray-300/80">
// 							Request Date
// 						</p>
// 						<p className="font-medium dark:text-gray-300/80">
// 							{formatWithOrdinal(new Date(loan.requestDate))}
// 						</p>
// 					</div>
// 				</div>
// 			</div>

// 			<div>
// 				<p className="text-sm text-gray-600 dark:text-gray-300/80 mb-1">
// 					Purpose
// 				</p>
// 				<p className="text-gray-800 dark:text-gray-300/80 bg-background p-2 rounded-md">
// 					{loan.purpose}
// 				</p>
// 			</div>

// 			{loan.processedDate && (
// 				<div className="text-sm text-gray-600 dark:text-gray-300/80">
// 					Processed on{" "}
// 					{new Date(loan.processedDate).toLocaleDateString()} by{" "}
// 					{loan.processedBy}
// 				</div>
// 			)}
// 		</CardContent>
// 	</Card>
// );
