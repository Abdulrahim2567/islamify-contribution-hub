import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, CheckCircle, XCircle, Clock, User, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, getNowString } from "../../utils/calculations";
import { readMembersFromStorage } from "../../utils/membersStorage";
import { AdminActivityLog, IslamifyMemberNotification, LoanRequest, Member, MemberLoanActivity } from '@/types/types';
import { getLoanRequests, updateLoanRequest } from '@/utils/loanStorage';
import { saveAdminRecentActivity, saveMemberLoanActivity } from '@/utils/recentActivities';
import { saveMemberNotification } from '@/utils/notificationsStorage';

interface LoanRequest_ extends LoanRequest{
  adminNotes?: string;
}

//Member as LoanManagementProps
interface LoanManagementProps {
  user: Member;
}

const LoanManagement = ({ user }: LoanManagementProps) => {
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load loan requests from localStorage
    try {
      const stored = getLoanRequests();
      if (stored) {
        setLoanRequests(stored);
      }
    } catch (error) {
      console.error('Error loading loan requests:', error);
    }

    // Load members
    setMembers(readMembersFromStorage());
  }, []);

  const saveLoanRequests = (requests: LoanRequest[]) => {
    setLoanRequests(requests);
  };


  const handleApprove = (loanId: string) => {
    const loan = loanRequests.find(l => l.id === loanId);
    if (!loan) return;

    const updatedRequests = loanRequests.map(loan =>
      loan.id === loanId
        ? {
            ...loan,
            status: 'approved' as const,
            processedDate: getNowString(),
            processedBy: user.name
          }
        : loan
    );

    // Save updated requests
    updateLoanRequest(loanId, { ...loan, status: 'approved', processedDate: getNowString(), processedBy: user.name });

    saveLoanRequests(updatedRequests);
    
    // Add to admin activities

    const adminLoanActivity: AdminActivityLog = {
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "loan_approved",
      text: `Approved loan of ${formatCurrency(loan.amount)} for "${loan.memberName}"`,
      color: "green",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    };

    // Save admin activity
    saveAdminRecentActivity(adminLoanActivity);

    const memberLoanActivity:MemberLoanActivity = {
      id: Date.now() + Math.random(),
      type: "loan_approval",
      amount: loan.amount,
      memberId: loan.memberId,
      memberName: loan.memberName,
      date:getNowString(),
      performedBy: user.name,
      description: `Loan application approved`,
    };

    // Add to member activities
    saveMemberLoanActivity(memberLoanActivity);

    //crete a notification for the member
    const memberNotification: IslamifyMemberNotification = {
      id: Date.now(),
      memberId: loan.memberId,
      title: "Loan Approved! 🎉",
      message: `Your loan application for ${formatCurrency(loan.amount)} has been approved. The funds will be processed shortly.`,
      type: 'success',
      date: getNowString(),
      isRead: false
    };

    // Send notification to member
    saveMemberNotification(memberNotification);

    toast({
      title: "Loan Approved",
      description: `Loan of ${formatCurrency(loan.amount)} for ${loan.memberName} has been approved.`,
    });
  };

  const handleReject = (loanId: string) => {
    const loan = loanRequests.find(l => l.id === loanId);
    if (!loan) return;

    const updatedRequests = loanRequests.map(loan =>
      loan.id === loanId
        ? {
            ...loan,
            status: 'rejected' as const,
            processedDate: getNowString(),
            processedBy: 'Admin'
          }
        : loan
    );
    updateLoanRequest(loanId, { ...loan, status: 'rejected', processedDate: getNowString(), processedBy: user.name });
    saveLoanRequests(updatedRequests);

    // Create admin activity
    const adminActivity: AdminActivityLog = {
    id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "loan_rejected",
      text: `Rejected loan request of ${formatCurrency(loan.amount)} for "${loan.memberName}"`,
      color: "red",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    };
    // Save admin activity
    saveAdminRecentActivity(adminActivity);

    // Create member activity
    const memberActivity: MemberLoanActivity = {
      type: "loan_rejection",
      amount: loan.amount,
      memberId: loan.memberId,
      memberName: loan.memberName,
      date: getNowString(),
      performedBy: user.name,
      description: `Loan application rejected`,
    };

    // Save member activity
    saveMemberLoanActivity(memberActivity);

    // Create notification for the member
    const memberNotification: IslamifyMemberNotification = {
      id: Date.now(),
      memberId: loan.memberId,
      title: "Loan Application Update",
      message: `Your loan application for ${formatCurrency(loan.amount)} has been reviewed and unfortunately could not be approved at this time. Please contact the admin for more details.`,
      type: 'warning',
      date: getNowString(),
      isRead: false
    };
    // Save notification to member
    saveMemberNotification(memberNotification);

    toast({
      title: "Loan Rejected",
      description: `Loan request from ${loan.memberName} has been rejected.`,
      variant: "destructive",
    });
  };

  const pendingRequests = loanRequests.filter(loan => loan.status === 'pending');
  const approvedRequests = loanRequests.filter(loan => loan.status === 'approved');
  const rejectedRequests = loanRequests.filter(loan => loan.status === 'rejected');

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  const LoanCard = ({ loan, showActions = false }: { loan: LoanRequest; showActions?: boolean }) => (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            {loan.memberName}
          </CardTitle>
          <Badge className={`flex items-center gap-1 ${getStatusColor(loan.status)}`}>
            {getStatusIcon(loan.status)}
            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-semibold text-lg text-green-600">{formatCurrency(loan.amount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Request Date</p>
              <p className="font-medium">{new Date(loan.requestDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-1">Purpose</p>
          <p className="text-gray-800 bg-gray-50 p-2 rounded-md">{loan.purpose}</p>
        </div>

        {loan.processedDate && (
          <div className="text-sm text-gray-600">
            Processed on {new Date(loan.processedDate).toLocaleDateString()} by {loan.processedBy}
          </div>
        )}

        {showActions && loan.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleApprove(loan.id)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white flex-1 animate-scale-in"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => handleReject(loan.id)}
              variant="destructive"
              className="flex-1 animate-scale-in"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12 animate-fade-in">
      <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No {type} loans</h3>
      <p className="text-gray-500">
        {type === 'pending' && "No loan requests are waiting for approval."}
        {type === 'approved' && "No loans have been approved yet."}
        {type === 'rejected' && "No loan requests have been rejected."}
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Loan Management
          </h1>
        </div>
        <p className="text-gray-600">Review and manage member loan requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-fade-in border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Loans</p>
                <p className="text-3xl font-bold text-green-600">{approvedRequests.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Requests</p>
                <p className="text-3xl font-bold text-red-600">{rejectedRequests.length}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Requests Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="requests" className="flex items-center gap-2" color='yellow'>
            <Clock className="w-4 h-4" />
            Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2" color='green'>
            <CheckCircle className="w-4 h-4" />
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2" color='red'>
            <XCircle className="w-4 h-4" />
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((loan) => (
              <LoanCard key={loan.id} loan={loan} showActions={true} />
            ))
          ) : (
            <EmptyState type="pending" />
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.length > 0 ? (
            approvedRequests.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))
          ) : (
            <EmptyState type="approved" />
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))
          ) : (
            <EmptyState type="rejected" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoanManagement;
