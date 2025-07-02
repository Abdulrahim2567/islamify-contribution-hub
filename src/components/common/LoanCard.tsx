import { AnimatedClockIcon } from "@/components/ui/AnimatedClock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoanRequest } from "@/types/types";
import { formatCurrency } from "@/utils/calculations";
import { formatDistanceToNow } from "date-fns";
import { User2Icon, Coins, Badge, XCircle, CheckCircle } from "lucide-react";
import React from "react";

interface LoanCardProps {
	loan: LoanRequest;
	showActions: boolean;
	handleReject: (loanId: string) => void;
	handleApprove: (loanId: string) => void;
}

const LoanCard: React.FC<LoanCardProps> = ({
	loan,
	showActions,
	handleApprove,
	handleReject,
}) => (
	<Card className="border border-gray-200 dark:border-gray-900 rounded-xl shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] flex flex-col min-w-[270px] md:max-w-[320px] animate-fade-in">
		<CardContent className="flex flex-col justify-between h-full p-4 space-y-4">
			{/* Section 1: Summary */}
			<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300/80 mb-4 flex items-center gap-2">
							<User2Icon className="w-4 h-4 text-emerald-600" />
							{loan.memberName}
						</h3>
						<p className="text-lg font-bold text-gray-700 dark:text-gray-300/80 flex">
							<Coins size={18} className="mr-2 mt-1" />
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
							{formatDistanceToNow(new Date(loan.requestDate), {
								addSuffix: true,
							}).replace(/^about\s/, "")}
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
						{new Date(loan.processedDate).toLocaleDateString()} by{" "}
						<span className="opacity-80">{loan.processedBy}</span>
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

export default LoanCard;

const getStatusIcon = (status: string) => {
	switch (status) {
		case "pending":
			return <AnimatedClockIcon />;
		case "approved":
			return <CheckCircle className="w-4 h-4" />;
		case "rejected":
			return <XCircle className="w-4 h-4" />;
		default:
			return <AnimatedClockIcon />;
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
