
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  needsPasswordChange: boolean;
  registrationFee: number;
  totalContributions: number;
  isActive: boolean;
  loanEligible: boolean;
  canApplyForLoan: boolean; // Indicates if the member can apply for a loan
  joinDate: string;
  role: "member" | "admin";
}

export interface AdminActivityLog {
  id: number;
  timestamp: string;
  type: string;
  text: string;
  color: string;
  adminName: string;
  adminEmail: string;
  adminRole: "member" | "admin";
  memberId?: number; // Optional for actions not related to a specific member
  isRead?:boolean
}




export interface AdminDashboardData {
  totalMembers: number;
  totalContributions: number;
  totalLoans: number;
  totalActiveMembers: number;
  totalInactiveMembers: number;
  recentActivities: AdminActivityLog[];
}

export interface Contribution {
  id: number
  memberId: number;
  amount: number;
  date: string;
  lastEdited: string; // Timestamp of the last edit
  description: string;
  addedBy: string; // Admin or member who added the contribution
  editedBy?: string; // Admin who edited the contribution
  type: "contribution"
}



export interface ContributionRecordActivity extends Contribution {
  memberName: string;
}

export interface MemberLoanActivity {
  type: "loan_request" | "loan_approval" | "loan_rejection";
  amount: number;
  memberId: number;
  memberName: string;
  date: string; // ISO date string
  performedBy: string; // Name of the person who performed the action
  description?: string; // Optional description for contributions or loan requests
}

export interface Loan {
  memberId: number;
  amount: number;
  date: string;
  description?: string;
}

export interface LoanRecord extends Loan {
  type: "loan";
  memberName: string;
  performedBy: string;
}

export interface LoanRequest {
  id: string; // Unique identifier for the loan request
  dueDate?: string; // Optional due date for the loan
  paymentInterval?: string; // Optional payment interval
  paymentIntervalAmount?: number; // Optional amount per payment interval
  nextPaymentDate?: string; // Optional next payment date
  nextPaymentAmount?: number; // Optional amount for the next payment
  memberId: number; // ID of the member requesting the loan
  memberName: string; // Name of the member
  amount: number; // Amount requested
  purpose: string; // Purpose of the loan
  requestDate: string; // Date of the request
  status: "pending" | "approved" | "rejected"; // Status of the loan request
  processedBy?: string; // Optional, name of the admin who processed the request
  processedDate?: string; // Optional, date when the request was processed
}

export interface AdminLoanActivity {
  id: number;
  timestamp: string;
  type: "loan_request" | "loan_approval" | "loan_rejection";
  text: string;
  color: string;
  adminName: string;
  adminEmail?: string; // Optional for member actions
  adminRole: "member" | "admin";
  memberId: number; // ID of the member related to the activity
}


export interface AppSettings {
  associationName: string;
  registrationFee: number;
  maxLoanMultiplier: number;
  loanEligibilityThreshold: number; // Optional, can be added later
}