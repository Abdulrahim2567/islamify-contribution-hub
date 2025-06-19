
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
