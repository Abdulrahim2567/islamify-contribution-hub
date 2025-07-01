import { formatCurrency } from "@/utils/calculations";
import { CreditCard, TrendingUp } from "lucide-react";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { AppSettings } from "@/types/types";
import { Badge } from "../ui/badge";

interface MemberStatsCardsProps {
	totalContributions: number;
	maxLoanAmount: number;
	settings: AppSettings;
	registrationFee: number;
}

const MemberStatsCards: React.FC<MemberStatsCardsProps> = ({
	totalContributions,
	maxLoanAmount,
	settings,
	registrationFee,
}) => {
	return (
		<div className="container mx-auto px-4 py-8">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<Card className="animate-fade-in">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-300/80">
									Total Contributions
								</p>
								<p className="text-3xl font-bold text-blue-600 dark:text-blue-300/80">
									{formatCurrency(totalContributions)}
								</p>
							</div>
							<TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-300/80" />
						</div>
					</CardContent>
				</Card>

				<Card className="animate-fade-in">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-300/80">
									Max Loan Amount
								</p>
								<p className="text-3xl font-bold text-green-600 dark:text-gray-300/80">
									{formatCurrency(maxLoanAmount)}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									{settings.maxLoanMultiplier}× your
									contributions
								</p>
							</div>
							<CreditCard className="w-8 h-8 text-green-600 dark:text-green-300/80" />
						</div>
					</CardContent>
				</Card>

				<Card className="animate-fade-in">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-300/80">
									Registration Fee
								</p>
								<p className="text-3xl font-bold text-purple-600 dark:text-purple-300/80">
									{formatCurrency(registrationFee)}
								</p>
								<Badge
									variant="outline"
									className="mt-2 text-green-600 border-green-600"
								>
									✓ Paid
								</Badge>
							</div>
							<div className="w-8 h-8 bg-purple-100 dark:bg-purple-300/5 rounded-full flex items-center justify-center">
								<span className="text-purple-600 dark:text-purple-300/80 font-bold">
									₣
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default MemberStatsCards;
