import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, CreditCard, Clock, CheckCircle, XCircle } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import MembersPage from "./member/MembersPage";
import { useToast } from "@/hooks/use-toast";
import { readMembers } from "../utils/membersStorage";
import MemberContributionHistory from "./member/MemberContributionHistory";
import LoanApplication from "./member/LoanApplication";
import { formatCurrency } from "../utils/calculations";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";
const LOANS_STORAGE_KEY = 'islamify_loan_requests';

const MemberDashboard = ({ user, onLogout }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [members, setMembers] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [memberLoans, setMemberLoans] = useState([]);

  // Store all activities for this member (contributions history)
  const [memberActivities, setMemberActivities] = useState([]);

  useEffect(() => {
    setMembers(readMembers());
  }, []);

  // Load member's loans
  useEffect(() => {
    try {
      const storedLoans = localStorage.getItem(LOANS_STORAGE_KEY);
      if (storedLoans) {
        const allLoans = JSON.parse(storedLoans);
        const userLoans = allLoans.filter(loan => loan.memberId === user.id);
        setMemberLoans(userLoans);
      }
    } catch (error) {
      console.error('Error loading member loans:', error);
    }
  }, [user.id, activeTab]);

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
        // Only contributions for this member (works for both regular members and admins)
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
  }, [user.id, activeTab]);

  // Always use sum from activities for display, to match what admin wrote
  const totalContributions = memberActivities.reduce((sum, a) => sum + (a.amount || 0), 0);

  const registrationFee = 5000;
  // For loan, also use activity sum instead of thisMember?.totalContributions
  const maxLoanAmount = totalContributions * 3;
  const canApplyForLoan = !!thisMember?.loanEligible;

  // Check if member has pending loan application
  const hasPendingLoan = memberLoans.some(loan => loan.status === 'pending');

  // ... keep existing code (getStatusIcon and getStatusColor functions)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="container mx-auto px-4 py-8">
            {/* Admin Notice */}
            {user.role === 'admin' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  👑 Admin View: You're viewing your personal member data. Your admin privileges are maintained.
                </p>
              </div>
            )}

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

            {canApplyForLoan && !hasPendingLoan && (
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

            {hasPendingLoan && (
              <div className="flex justify-end mb-6">
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-lg font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Loan Application Pending
                </div>
              </div>
            )}

            {showLoanModal && (
              <LoanApplication
                memberId={user.id.toString()}
                memberName={user.name}
                maxAmount={maxLoanAmount}
                onSubmit={data => {
                  setShowLoanModal(false);
                  toast({
                    title: "Loan Application Submitted",
                    description: `Your application for ${formatCurrency(data.amount)} is pending.`,
                  });
                  // Reload loans to show the new application
                  const storedLoans = localStorage.getItem(LOANS_STORAGE_KEY);
                  if (storedLoans) {
                    const allLoans = JSON.parse(storedLoans);
                    const userLoans = allLoans.filter(loan => loan.memberId === user.id);
                    setMemberLoans(userLoans);
                  }
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
        );
      case "loans":
        return (
          <div className="container mx-auto px-4 py-8">
            {/* Admin Notice */}
            {user.role === 'admin' && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  👑 Admin View: These are your personal loan applications as a member.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Loan Applications</h1>
              <p className="text-gray-600">Track your loan application status</p>
            </div>

            {memberLoans.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No loan applications</h3>
                <p className="text-gray-500">You haven't applied for any loans yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {memberLoans.map((loan) => (
                  <Card key={loan.id} className="animate-fade-in hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Loan Application #{loan.id.slice(-6)}
                        </h3>
                        <Badge className={`flex items-center gap-1 ${getStatusColor(loan.status)}`}>
                          {getStatusIcon(loan.status)}
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Amount Requested</p>
                          <p className="font-semibold text-lg text-green-600">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Application Date</p>
                          <p className="font-medium">{new Date(loan.requestDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Purpose</p>
                        <p className="text-gray-800 bg-gray-50 p-2 rounded-md">{loan.purpose}</p>
                      </div>

                      {loan.processedDate && (
                        <div className="text-sm text-gray-600">
                          {loan.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(loan.processedDate).toLocaleDateString()} by {loan.processedBy}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      case "members":
        return <MembersPage currentUser={user} />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
          user={user}
        />
        <SidebarInset>
          <div className="min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {user.role === 'admin' ? 'Islamify Admin (Member View)' : 'Islamify Member'}
                    </h1>
                    <p className="text-gray-600">Welcome back, {user.name}</p>
                  </div>
                </div>
              </div>
            </div>
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MemberDashboard;
