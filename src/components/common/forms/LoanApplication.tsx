// LoanApplication.tsx
import React, { useState } from "react";
import { Check, CreditCard, X } from "lucide-react";
import { formatCurrency, getNowString } from "@/utils/calculations";
import { useToast } from "@/hooks/use-toast";
import {
	AdminActivityLog,
	LoanRequest,
	MemberLoanActivity,
} from "@/types/types";
import {
	saveAdminRecentActivity,
	saveMemberLoanActivity,
} from "@/utils/recentActivitiesStorage";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import { Input } from "../../ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface LoanApplicationProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	memberId: string;
	memberName: string;
	memberEmail?: string;
	maxAmount: number;
	maxLoanMultiplier?: number;
	onSubmit: (data: { amount: number; purpose: string }) => void;
}

const LoanApplication: React.FC<LoanApplicationProps> = ({
	open,
	onOpenChange,
	memberId,
	memberName,
	memberEmail,
	maxAmount,
	maxLoanMultiplier,
	onSubmit,
}) => {
	const { toast } = useToast();
	const { addLoanRequest } = useLoanRequests();
	const [formData, setFormData] = useState({ amount: "", reason: "" });

	const amount = parseFloat(formData.amount) || 0;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (amount <= 0 || amount > maxAmount) {
			toast({
				title: "Invalid Amount",
				description: `Enter an amount between 1 and ${formatCurrency(
					maxAmount
				)}`,
				variant: "destructive",
			});
			return;
		}

		const loanRequest: LoanRequest = {
			dueDate: undefined,
			paymentInterval: undefined,
			paymentIntervalAmount: undefined,
			nextPaymentDate: undefined,
			nextPaymentAmount: undefined,
			memberId: memberId,
			memberName,
			amount,
			purpose: formData.reason,
			status: "pending",
		};

		addLoanRequest(loanRequest);

		const memberActivity: MemberLoanActivity = {
			type: "loan_request",
			amount,
			memberId: memberId,
			memberName,
			performedBy: memberName,
			description: formData.reason,
		};

		const adminActivity: AdminActivityLog = {
			type: "loan_request",
			text: `Loan request of ${formatCurrency(
				amount
			)} submitted by ${memberName}.`,
			color: "blue",
			adminName: memberName,
			adminEmail: memberEmail,
			adminRole: "member",
			memberId: memberId,
		};

		saveMemberLoanActivity(memberActivity);
		saveAdminRecentActivity(adminActivity);

		toast({
			title: "Loan Request Submitted",
			description: `Your loan request of ${formatCurrency(
				amount
			)} has been submitted successfully.`,
		});

		onSubmit({ amount, purpose: formData.reason });
		onOpenChange(false);
		setFormData({ amount: "", reason: "" });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center">
						<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<CreditCard className="w-8 h-8 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300/80">
							Apply For Loan
						</h2>
						<p className="text-gray-500 dark:text-gray-400/80 text-sm">
							Submit your loan request to the association
						</p>
					</DialogTitle>
				</DialogHeader>

				<div className="bg-emerald-50 dark:bg-emerald-400/5 border border-emerald-200 dark:border-emerald-500/80 border-dashed rounded-lg p-4 mb-6">
					<p className="text-sm text-emerald-800 dark:text-emerald-300/80 text-center">
						<strong>Maximum loan amount:</strong>{" "}
						{formatCurrency(maxAmount)}
					</p>
					{maxLoanMultiplier && (
						<p className="text-xs text-emerald-600 dark:text-emerald-400/80 text-center mt-1">
							Based on {maxLoanMultiplier}× your current savings
						</p>
					)}
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-400/80 mb-2">
							Loan Amount (XAF)
						</label>
						<div className="relative">
							<CreditCard
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300/80 pointer-events-none input-icon"
								size={20}
							/>
							<Input
								type="number"
								value={formData.amount}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										amount: e.target.value,
									}))
								}
								className="w-full pl-10 focus-visible:ring-1 focus-visible:ring-emerald-500"
								placeholder="Enter loan amount"
								required
								min="1"
								max={maxAmount}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-400/80 mb-2">
							Purpose of Loan
						</label>
						<Textarea
							value={formData.reason}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									reason: e.target.value,
								}))
							}
							className="w-full"
							placeholder="Describe why you need this loan..."
							rows={4}
							required
						/>
					</div>

					<div className="flex justify-center gap-3">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="px-4 py-2 rounded-lg w-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-400/5 transition"
						>
							<X className="inline mr-1 -mt-1" size={16} />
							Cancel
						</button>
						<button
							type="submit"
							className="bg-gradient-to-r w-full from-emerald-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition"
						>
							<Check className="inline mr-1 -mt-1" size={16} />
							Submit
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default LoanApplication;
