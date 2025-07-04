import { LoanRequest } from "@/types/types";

const LOANS_STORAGE_KEY = "islamify_loan_requests";

export const saveLoanRequest = (loanRequest: LoanRequest) => {
    const requests = getLoanRequests();
    requests.push(loanRequest);
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(requests));
};

export const getLoanRequests = (): LoanRequest[] => {
    const requests = localStorage.getItem(LOANS_STORAGE_KEY);
    return requests ? JSON.parse(requests) : [];
};
export const getLoanRequestById = (id: string): LoanRequest | null => {
    const requests = getLoanRequests();
    return requests.find((request) => request._id === id) || null;
};
export const updateLoanRequest = (id: string, updatedRequest: LoanRequest) => {
    const requests = getLoanRequests();
    const index = requests.findIndex((request) => request._id === id);
    if (index !== -1) {
        requests[index] = updatedRequest;
        localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(requests));
    }
};
export const deleteLoanRequest = (id: string) => {
    const requests = getLoanRequests();
    const filtered = requests.filter((request) => request._id !== id);
    localStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(filtered));
};
export const clearLoanRequests = () => {
    localStorage.removeItem(LOANS_STORAGE_KEY);
};
export const getTotalLoanAmount = (): number => {
    const requests = getLoanRequests();
    return requests.reduce((total, request) => total + request.amount, 0);
};
export const getTotalMemberLoanAmount = (memberId: string): number => {
    const requests = getLoanRequests();
    return requests
        .filter((request) => request.memberId === memberId)
        .reduce((total, request) => total + request.amount, 0);
};
export const getPendingLoanRequests = (memberId?: string): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => {
        const isStatusMatch = request.status === "pending";
        const isMemberMatch = memberId !== undefined ? request.memberId === memberId : true;
        return isStatusMatch && isMemberMatch;
    });
};

export const getApprovedLoanRequests = (memberId?: string): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => {
        const isStatusMatch = request.status === "approved";
        const isMemberMatch = memberId !== undefined ? request.memberId === memberId : true;
        return isStatusMatch && isMemberMatch;
    });
};

export const getRejectedLoanRequests = (memberId?: string): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => {
        const isStatusMatch = request.status === "rejected";
        const isMemberMatch = memberId !== undefined ? request.memberId === memberId : true;
        return isStatusMatch && isMemberMatch;
    });
};

export const getLoanRequestsByMemberId = (memberId: string): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => request.memberId === memberId);
};
export const getLoanRequestsByStatus = (status: "pending" | "approved" | "rejected"): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => request.status === status);
};
export const getLoanRequestsByDateRange = (startDate: string, endDate: string): LoanRequest[] => {
    const requests = getLoanRequests();
    return requests.filter((request) => {
        const requestDate = new Date(request.requestDate);
        return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
    });
};
