
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  registrationFee: number;
  totalContributions: number;
  isActive: boolean;
  loanEligible: boolean;
  joinDate: string;
  role: "member" | "admin";
}

export interface Activity {
  id: number;
  timestamp: string;
  type: string;
  text: string;
  color?: string;
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
}

export interface ContributionRecord {
  id: number;
  type: "contribution";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  performedBy: string;
  description?: string;
}

export interface LoanRecord {
  id: number;
  type: "loan";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  dueDate: string;
  interestRate: number;
  status: "pending" | "approved" | "rejected" | "paid";
  performedBy: string;
  description?: string;
}
