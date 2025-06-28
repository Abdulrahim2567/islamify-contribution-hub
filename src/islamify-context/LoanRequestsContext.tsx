import React, { useEffect, useState } from "react";
import { LoanRequest } from "@/types/types";
import {
	saveLoanRequest,
	getLoanRequests,
	updateLoanRequest,
	deleteLoanRequest,
	clearLoanRequests as clearFromStorage,
} from "@/utils/loanStorage"; // Adjust to your path
import { LoanRequestsContext } from "@/hooks/useLoanRequests";

export interface LoanRequestsContextProps {
	loanRequests: LoanRequest[];
	refreshLoanRequests: () => void;
	addLoanRequest: (loanRequests: LoanRequest) => void;
	updateLoanRequest: (id: string, loanRequests: LoanRequest) => void;
	deleteLoanRequest: (id: string) => void;
	clearLoanRequests: () => void;

	// Derived state accessors using `loanRequests` state
	getLoanRequestsById: (id: string) => LoanRequest | null;
	getTotalLoanRequests: () => number;
	getTotalLoanRequestsByMember: (memberId: number) => number;
	getLoanRequestsByStatus: (
		status: "pending" | "approved" | "rejected"
	) => LoanRequest[];
	getLoanRequestsByMemberId: (memberId: number) => LoanRequest[];
	getLoanRequestsByDateRange: (start: string, end: string) => LoanRequest[];
	getPendingLoanRequests: (memberId?: number) => LoanRequest[];
	getApprovedLoanRequests: (memberId?: number) => LoanRequest[];
	getRejectedLoanRequests: (memberId?: number) => LoanRequest[];
}

export const LoanRequestsProvider = ({ children }: { children: React.ReactNode }) => {
	const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);

	useEffect(() => {
		setLoanRequests(getLoanRequests());
	}, []);

	const refreshLoanRequests = () => {
		setLoanRequests(getLoanRequests());
	};

	const addLoanRequest = (loanRequests: LoanRequest) => {
		saveLoanRequest(loanRequests);
		refreshLoanRequests();
	};

	const updateLoanRequest = (id: string, loanRequests: LoanRequest) => {
		updateLoanRequest(id, loanRequests);
		refreshLoanRequests();
	};

	const deleteLoanRequest = (id: string) => {
		deleteLoanRequest(id);
		refreshLoanRequests();
	};

	const clearLoanRequests = () => {
		clearFromStorage();
		refreshLoanRequests();
	};

	// Derived accessors using `loanRequests` state
	const getLoanRequestsById = (id: string) => loanRequests.find((l) => l.id === id) || null;

	const getTotalLoanRequests = () => loanRequests.reduce((sum, l) => sum + l.amount, 0);

	const getTotalLoanRequestsByMember = (memberId: number) =>
		loanRequests
			.filter((l) => l.memberId === memberId)
			.reduce((sum, l) => sum + l.amount, 0);

	const getLoanRequestsByStatus = (status: "pending" | "approved" | "rejected") =>
		loanRequests.filter((l) => l.status === status);

	const getLoanRequestsByMemberId = (memberId: number) =>
		loanRequests.filter((l) => l.memberId === memberId);

	const getLoanRequestsByDateRange = (start: string, end: string) => {
		const startDate = new Date(start);
		const endDate = new Date(end);
		return loanRequests.filter((l) => {
			const requestDate = new Date(l.requestDate);
			return requestDate >= startDate && requestDate <= endDate;
		});
	};

	const getPendingLoanRequests = (memberId?: number) =>
		loanRequests.filter(
			(l) =>
				l.status === "pending" &&
				(memberId === undefined || l.memberId === memberId)
		);

	const getApprovedLoanRequests = (memberId?: number) =>
		loanRequests.filter(
			(l) =>
				l.status === "approved" &&
				(memberId === undefined || l.memberId === memberId)
		);

	const getRejectedLoanRequests = (memberId?: number) =>
		loanRequests.filter(
			(l) =>
				l.status === "rejected" &&
				(memberId === undefined || l.memberId === memberId)
		);

	const values: LoanRequestsContextProps = {
		loanRequests,
		refreshLoanRequests,
		addLoanRequest,
		updateLoanRequest,
		deleteLoanRequest,
		clearLoanRequests,
		getLoanRequestsById,
		getTotalLoanRequests,
		getTotalLoanRequestsByMember,
		getLoanRequestsByStatus,
		getLoanRequestsByMemberId,
		getLoanRequestsByDateRange,
		getPendingLoanRequests,
		getApprovedLoanRequests,
		getRejectedLoanRequests,
	};

	return (
		<LoanRequestsContext.Provider value={values}>{children}</LoanRequestsContext.Provider>
	);
};
