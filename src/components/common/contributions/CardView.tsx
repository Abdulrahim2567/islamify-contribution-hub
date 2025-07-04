import React from "react";
import { Contribution } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Pencil, Trash2, User2Icon } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";
import { formatDistanceToNow } from "date-fns";
import { formatWithOrdinal } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContributionRecord extends Contribution {
	memberName: string;
}

interface CardViewProps {
	paginatedData: ContributionRecord[];
	readOnly: boolean;
	dateFormat: string;
	onEdit: (record: ContributionRecord) => void;
	onDelete: (record: ContributionRecord) => void;
}

const CardView: React.FC<CardViewProps> = ({
	paginatedData,
	readOnly,
	dateFormat,
	onEdit,
	onDelete,
}) => {
	return (
		<div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start">
			{paginatedData.length === 0 ? (
				<Card className="animate-fade-in items-center justify-center flex w-full border-0">
					<CardContent className="p-8 text-center text-gray-500 dark:text-gray-300/80">
						<div className="flex flex-col items-center gap-3">
							<Coins className="w-12 h-12 text-gray-300 dark:text-300/80" />
							<span>No contributions found.</span>
						</div>
					</CardContent>
				</Card>
			) : (
				paginatedData.map((rec, idx) => (
					<Card
						key={idx}
						className="border border-gray-200 dark:border-gray-900 rounded-xl shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] flex flex-col min-w-[270px] md:max-w-[320px] animate-fade-in"
					>
						<CardContent className="flex flex-col justify-between h-full p-4 space-y-4">
							{/* Section 1 */}
							<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300/80 mb-5 flex">
											<User2Icon
												size={18}
												className="mr-2"
											/>
											{rec.memberName}
										</h3>
										<p className="font-bold text-lg text-gray-700 dark:text-gray-300/80 flex">
											<Coins
												size={18}
												className="mt-1 mr-2"
											/>
											{formatCurrency(rec.amount)}
										</p>
									</div>
									<p className="text-xs text-gray-500 dark:text-gray-300/70 whitespace-nowrap">
										{dateFormat === "relative"
											? formatDistanceToNow(
													new Date(rec.createdAt),
													{
														addSuffix: true,
													}
											  ).replace(/^about\s/, "")
											: formatWithOrdinal(
													new Date(rec.createdAt)
											  )}
									</p>
								</div>
							</div>

							{/* Section 2 */}
							<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl space-y-2">
								{rec.description && (
									<div>
										<p className="text-[12px] font-medium text-gray-600 dark:text-gray-400/60">
											Description:
										</p>
										<p className="text-[12px] text-gray-800 dark:text-gray-300/80 opacity-80 my-3">
											{rec.description}
										</p>
									</div>
								)}
								<p className="text-[12px] text-gray-700 dark:text-gray-300/80">
									<span className="font-medium text-gray-600 dark:text-gray-400/60">
										Added by:
									</span>{" "}
									<span className="opacity-80">
										{rec.addedBy}
									</span>
								</p>
								<p className="text-[12px] text-gray-700 dark:text-gray-300/80">
									<span className="font-medium text-gray-600 dark:text-gray-400/60">
										Edited by:
									</span>{" "}
									<span className="opacity-80">
										{rec.editedBy || "Not Edited"}
									</span>
								</p>
							</div>

							{/* Footer - aligned at bottom */}
							{!readOnly && (
								<div className="flex gap-2 pt-2 mt-auto">
									<Button
										size="sm"
										variant="outline"
										className="text-xs flex-1 flex items-center gap-1 dark:text-gray-300/80"
										onClick={() => onEdit(rec)}
									>
										<Pencil className="w-3 h-3" /> Edit
									</Button>
									<Button
										size="sm"
										variant="destructive"
										className="text-xs flex-1 flex items-center gap-1 dark:text-gray-300/80"
										onClick={() => onDelete(rec)}
									>
										<Trash2 className="w-3 h-3" /> Delete
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				))
			)}
		</div>
	);
};

export default CardView;
