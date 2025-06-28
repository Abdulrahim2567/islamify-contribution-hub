
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CreditCard, Clock, CheckCircle, XCircle, User } from "lucide-react";
import { formatCurrency } from "../../utils/calculations";
import { getSettings } from "../../utils/settingsStorage";
import MemberContributionHistory from "../member/MemberContributionHistory";
import { LoanRequest } from '@/types/types';

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";
const LOANS_STORAGE_KEY = 'islamify_loan_requests';

interface AdminPersonalViewProps {
  user: {
    id: number;
    name: string;
    role: string;
  };
}

const AdminPersonalView: React.FC<AdminPersonalViewProps> = ({ user }) => {
  const [memberActivities, setMemberActivities] = useState([]);
  const [memberLoans, setMemberLoans] = useState([]);
  const [settings, setSettings] = useState(getSettings());

  // Load member's activities
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
      if (storedActivities) {
        const allActivities = JSON.parse(storedActivities);
        const filtered = allActivities.filter(
          (a: any) => a.type === "contribution" && a.memberId === user.id
        );
        setMemberActivities(filtered);
      }
    } catch (err) {
      console.error("Failed to load member activities", err);
      setMemberActivities([]);
    }
  }, [user.id]);

  // Load member's loans
  useEffect(() => {
    try {
      const storedLoans = localStorage.getItem(LOANS_STORAGE_KEY);
      if (storedLoans) {
        const allLoans = JSON.parse(storedLoans);
        const userLoans = allLoans.filter((loan: any) => loan.memberId === user.id);
        setMemberLoans(userLoans);
      }
    } catch (error) {
      console.error('Error loading member loans:', error);
    }
  }, [user.id]);

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings(event.detail);
    };

    window.addEventListener('settingsChanged', handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  const totalContributions = memberActivities.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);
  const maxLoanAmount = totalContributions * settings.maxLoanMultiplier;
  const hasPendingLoan = memberLoans.some((loan: LoanRequest) => loan.status === 'pending');

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <p className="text-blue-800 font-medium">
            Your Personal Member Data
          </p>
        </div>
        <p className="text-blue-600 text-sm mt-1">
          This shows your personal contributions and loans as a member of the association.
        </p>
      </div>

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
                <p className="text-xs text-gray-500 mt-1">{settings.maxLoanMultiplier}× your contributions</p>
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
                <p className="text-3xl font-bold text-purple-600">{settings.registrationFee.toLocaleString()} XAF</p>
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

      {/* Loan Applications */}
      {memberLoans.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Loan Applications</h2>
          <div className="space-y-4">
            {memberLoans.map((loan: any) => (
              <Card key={loan.id} className="animate-fade-in hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Loan #{loan.id.slice(-6)}
                    </h3>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(loan.status)}`}>
                      {getStatusIcon(loan.status)}
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-semibold text-green-600">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(loan.requestDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Purpose</p>
                    <p className="text-gray-800 bg-gray-50 p-2 rounded-md text-sm">{loan.purpose}</p>
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
        </div>
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
};

export default AdminPersonalView;
