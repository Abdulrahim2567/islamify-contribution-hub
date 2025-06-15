import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Wallet, CreditCard } from "lucide-react";
import MembersPage from "./member/MembersPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { readMembers } from "../utils/membersStorage";
import MemberContributionHistory from "./member/MemberContributionHistory";
import LoanApplication from "./member/LoanApplication";
import { formatCurrency } from "../utils/calculations";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

const MemberDashboard = ({ user, onLogout }) => {
  const { toast } = useToast();
  const [tab, setTab] = useState<"dashboard" | "members">("dashboard");
  const [members, setMembers] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);

  // Store all activities for this member (contributions history)
  const [memberActivities, setMemberActivities] = useState([]);

  useEffect(() => {
    setMembers(readMembers());
  }, []);

  // Find current member record for up-to-date fields
  const thisMember = members.find((m) => m.id === user.id);

  // Fetch member's real contributions from localStorage recent activities
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
      if (storedActivities) {
        const allActivities = JSON.parse(storedActivities);
        // DEBUG: Log all activities found for inspection
        console.log("All islamify_recent_activities:", allActivities);
        // Only contributions for this member
        const filtered = allActivities
          .filter(
            (a) =>
              a.type === "contribution" &&
              typeof a.memberId === "number" &&
              a.memberId === user.id
          );
        // DEBUG: Log activities filtered for this user
        console.log("Filtered activities for member", user.id, filtered);
        setMemberActivities(filtered);
      } else {
        setMemberActivities([]);
      }
    } catch (err) {
      console.log("Failed to read member activities", err);
      setMemberActivities([]);
    }
  }, [user.id, tab]);

  // Always use sum from activities for display, to match what admin wrote
  const totalContributions = memberActivities.reduce((sum, a) => sum + (a.amount || 0), 0);

  const registrationFee = 5000;
  // For loan, also use activity sum instead of thisMember?.totalContributions
  const maxLoanAmount = totalContributions * 3;
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

          {/* Contribution History */}
          <div className="mt-8">
            <MemberContributionHistory
              memberId={user.id}
              memberName={user.name}
            />
            {/* Diagnostics */}
            <div className="mt-4 text-xs text-gray-400">
              <div>Loaded <b>{memberActivities.length}</b> activity records.</div>
              {memberActivities.length > 0 && (
                <div>
                  First: {JSON.stringify(memberActivities[0], null, 2)}
                </div>
              )}
              <div className="hidden">{JSON.stringify(memberActivities)}</div>
            </div>
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
