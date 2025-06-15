import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Wallet, CreditCard, Plus } from "lucide-react";
import MembersPage from "./member/MembersPage";
import { Member } from "./admin/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { readMembers } from "../utils/membersStorage";
import MemberContributionHistory from "./member/MemberContributionHistory";
import LoanApplication from "./member/LoanApplication";
import { formatCurrency } from "../utils/calculations";

// Mock data for member contributions
const MOCK_CONTRIBUTIONS = [
  { id: 1, date: "2024-06-01", amount: 5000, type: "Monthly Contribution" },
  { id: 2, date: "2024-05-01", amount: 5000, type: "Monthly Contribution" },
  { id: 3, date: "2024-04-01", amount: 5000, type: "Monthly Contribution" },
  { id: 4, date: "2024-03-01", amount: 5000, type: "Monthly Contribution" },
  { id: 5, date: "2024-02-01", amount: 5000, type: "Monthly Contribution" },
];

const MemberDashboard = ({ user, onLogout }) => {
  const [contributions] = useState(MOCK_CONTRIBUTIONS);
  const { toast } = useToast();
  const [tab, setTab] = useState<"dashboard" | "members">("dashboard");
  const [members, setMembers] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);

  useEffect(() => {
    setMembers(readMembers());
  }, []);

  // Find myself in members array for up-to-date eligibility/fields
  const thisMember = members.find((m) => m.id === user.id);

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const maxLoanAmount = (thisMember?.totalContributions || 0) * 3;
  const registrationFee = 5000;
  const canApplyForLoan = !!thisMember?.loanEligible;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Islamify Member</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        <div className="container mx-auto px-4">
          {/* Tabs: Dashboard | Members Directory */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setTab("dashboard")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "dashboard"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-500 hover:bg-emerald-50"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab("members")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "members"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-500 hover:bg-emerald-50"
              }`}
            >
              Members Directory
            </button>
          </div>
        </div>
      </div>
      {tab === "dashboard" && (
        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                    <p className="text-3xl font-bold text-blue-600">{totalContributions.toLocaleString()} XAF</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Max Loan Amount</p>
                    <p className="text-3xl font-bold text-green-600">{maxLoanAmount.toLocaleString()} XAF</p>
                    <p className="text-xs text-gray-500 mt-1">3× your contributions</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Fee</p>
                    <p className="text-3xl font-bold text-purple-600">{registrationFee.toLocaleString()} XAF</p>
                    <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                      ✓ Paid
                    </Badge>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">₣</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {canApplyForLoan && (
            <div className="flex justify-end mb-6">
              <button
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all"
                onClick={() => setShowLoanModal(true)}
              >
                <CreditCard className="w-5 h-5" />
                Apply For Loan
              </button>
            </div>
          )}

          {showLoanModal && (
            <LoanApplication
              memberId={user.id.toString()}
              maxAmount={maxLoanAmount}
              onSubmit={data => {
                setShowLoanModal(false);
                toast({
                  title: "Loan Application Submitted",
                  description: `Your application for ${formatCurrency(data.amount)} is pending.`,
                });
              }}
              onCancel={() => setShowLoanModal(false)}
            />
          )}

          {/* Modern Contribution History (activities data) */}
          <div className="mt-8">
            <MemberContributionHistory memberId={user.id} memberName={user.name} />
          </div>
        </div>
      )}
      {tab === "members" && (
        <MembersPage
          currentUser={user}
        />
      )}
    </div>
  );
};

export default MemberDashboard;
