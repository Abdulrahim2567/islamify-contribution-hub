import React, { useState } from "react";
import { Eye, ToggleRight, ToggleLeft, UserX, Trash2 } from "lucide-react";
import DeleteMemberDialog from "./DeleteMemberDialog";
import type { Member } from "../../../types/types";

interface MemberActionFooterProps {
	member: Member;
	onView: (member: Member) => void;
	onLoanToggle: (id: number) => void;
	onDelete: (id: number) => void;
	readOnly?: boolean;
}

const MemberActionFooter: React.FC<MemberActionFooterProps> = ({
	member,
	onView,
	onLoanToggle,
	onDelete,
	readOnly = false,
}) => {
	const [showDelete, setShowDelete] = useState(false);

	const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

	return (
		<div
			className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-2 py-2"
			onClick={stopPropagation}
		>
			<div className="flex flex-1 justify-evenly gap-2">
				{/* View */}
				<button
					onClick={() => onView(member)}
					className="flex flex-col items-center justify-center hover:bg-emerald-100 text-emerald-600 hover:text-emerald-900 rounded-lg py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button"
					title="View details"
					tabIndex={0}
					type="button"
				>
					<Eye size={18} />
					<span className="mt-0.5 leading-none">View</span>
				</button>
				{/* Show loan/status/delete only if not readOnly */}
				{!readOnly && (
					<>
						{/* Toggle Loan */}
						<button
							onClick={() => onLoanToggle(member.id)}
							className={`flex flex-col items-center justify-center hover:bg-indigo-100 rounded-lg py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button
                ${member.loanEligible ? "text-indigo-600" : "text-gray-400"}
              `}
							title={
								member.loanEligible
									? "Disable Loan"
									: "Enable Loan"
							}
							tabIndex={0}
							type="button"
						>
							{member.loanEligible ? (
								<ToggleRight size={18} />
							) : (
								<ToggleLeft size={18} />
							)}
							<span className="mt-0.5 leading-none">
								{member.loanEligible
									? "Loan Enabled"
									: "Loan Disabled"}
							</span>
						</button>

						{/* Delete (only for non-admins) */}
						{member.role !== "admin" && (
							<>
								<button
									onClick={() => setShowDelete(true)}
									className="flex flex-col items-center justify-center rounded-lg hover:bg-red-100 text-red-600 py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button"
									title="Delete member"
									tabIndex={0}
									type="button"
								>
									<Trash2 size={18} />
									<span className="mt-0.5 leading-none">
										Delete
									</span>
								</button>
								<DeleteMemberDialog
									open={showDelete}
									onOpenChange={setShowDelete}
									memberName={member.name}
									onConfirm={() => {
										setShowDelete(false);
										onDelete(member.id);
									}}
								/>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default MemberActionFooter;
