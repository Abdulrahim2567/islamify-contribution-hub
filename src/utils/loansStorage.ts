
import type { LoanRecord } from "../components/admin/types";

const LOANS_KEY = "islamify_loans";

/** Read all loans from localStorage, or return [] if not present. */
export function readLoans(): LoanRecord[] {
  try {
    const data = localStorage.getItem(LOANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist an updated loans array in localStorage. */
export function writeLoans(loans: LoanRecord[]): void {
  localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
}

/** Create a new loan and add to localStorage. */
export function createLoan(loan: LoanRecord): void {
  const loans = readLoans();
  const updatedLoans = [...loans, loan];
  writeLoans(updatedLoans);
}

/** Update an existing loan in localStorage. */
export function updateLoan(loanData: LoanRecord): void {
  const loans = readLoans();
  const updatedLoans = loans.map(loan =>
    loan.id === loanData.id ? loanData : loan
  );
  writeLoans(updatedLoans);
}

/** Delete a loan from localStorage. */
export function deleteLoan(loanId: number): void {
  const loans = readLoans();
  const updatedLoans = loans.filter(loan => loan.id !== loanId);
  writeLoans(updatedLoans);
}
