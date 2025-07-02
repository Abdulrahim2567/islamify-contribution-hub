import React from "react";
import { Card, CardContent } from "../ui/card";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { LoanRequest } from "@/types/types";

interface LoanStatsCardsProps {
	pendingRequests: LoanRequest[];
	approvedRequests: LoanRequest[];
	rejectedRequests: LoanRequest[];
}

const LoanStatsCards: React.FC<LoanStatsCardsProps> = ({
	pendingRequests,
	approvedRequests,
	rejectedRequests,
}) => {
	return (
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
	);
};

export default LoanStatsCards;
