import { Member } from "@/types/types";
import React from "react";
import LoanManagement from "../loan/LoanManagement";
import { useLoanRequests } from "@/hooks/useLoanRequests";
import MemberLoans from "@/components/member/MemberLoans";
interface LoanProps {
	user: Member;
}
const Loan: React.FC<LoanProps> = ({ user }) => {
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
				<LoanManagement user={user} />
			) : (
				<MemberLoans
					memberLoans={memberLoans}
					pendingRequests={pendingRequests}
					approvedRequests={approvedRequests}
					rejectedRequests={rejectedRequests}
				/>
			)}
		</>
	);
};

export default Loan;
