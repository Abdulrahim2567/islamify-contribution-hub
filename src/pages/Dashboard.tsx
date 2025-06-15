
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Wallet, CreditCard, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import AdminRecentActivity from "@/components/admin/AdminRecentActivity";
import MemberContributionHistory from "@/components/member/MemberContributionHistory";
import LoanApplication from "@/components/member/LoanApplication";
import { formatCurrency } from "@/utils/calculations";
import { useState, useEffect } from "react";
import { readMembers } from "@/utils/membersStorage";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

export default function DashboardPage(props: any) {
  const { user, onLogout, users, onNewUser } = props;
  const { toast } = useToast();
  const [members, setMembers] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [memberActivities, setMemberActivities] = useState([]);

  useEffect(() => {
    setMembers(readMembers());
  }, []);

  // For members: Fetch member's real contributions from localStorage recent activities
  useEffect(() => {
    if (user?.role !== "admin") {
      try {
        const storedActivities = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
        if (storedActivities) {
          const allActivities = JSON.parse(storedActivities);
          const filtered = allActivities
            .filter(
              (a) =>
                a.type === "contribution" &&
                typeof a.memberId === "number" &&
                a.memberId === user.id
            );
          setMemberActivities(filtered);
        } else {
          setMemberActivities([]);
        }
      } catch (err) {
        console.log("Failed to read member activities", err);
        setMemberActivities([]);
      }
    }
  }, [user?.id, user?.role]);

  if (!user) return null;

  // Member dashboard content
  if (user.role !== "admin") {
    const thisMember = members.find((m) => m.id === user.id);
    const totalContributions = memberActivities.reduce((sum, a) => sum + (a.amount || 0), 0);
    const registrationFee = 5000;
    const maxLoanAmount = totalContributions * 3;
    const canApplyForLoan = !!thisMember?.loanEligible;

    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar current="dashboard" />
          <main className="flex flex-1 flex-col">
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
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user.name}</p>
                      </div>
                    </div>
                    <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </div>

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
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Admin dashboard content
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar current="dashboard" />
        <main className="flex flex-1 flex-col">
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                      <p className="text-gray-600">Welcome back, {user.name}</p>
                    </div>
                  </div>
                  <Button onClick={onLogout} variant="outline" className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8">
              {/* Stats Cards */}
              <AdminStatsCards users={users} />
              
              {/* Recent Activity */}
              <div className="mt-8">
                <AdminRecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
