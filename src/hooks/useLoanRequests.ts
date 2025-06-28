import { createContext, useContext } from "react";
import { LoanRequestsContextProps } from "@/islamify-context/LoanRequestsContext";

export const LoanRequestsContext = createContext<LoanRequestsContextProps | undefined>(undefined);

export const useLoanRequests = (): LoanRequestsContextProps => {
	const context = useContext(LoanRequestsContext);
	if (!context) {
		throw new Error("useLoans must be used within a LoansProvider");
	}
	return context;
};
