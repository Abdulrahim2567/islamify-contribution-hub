import React, { useState, useEffect } from 'react';
import { Member, Activity } from './admin/types';
import AdminNavbar from './admin/AdminNavbar';
import AdminStatsCards from './admin/AdminStatsCards';
import AdminRecentActivity from './admin/AdminRecentActivity';
import MembersTable from './admin/MembersTable';
import ContributionsTable from './admin/ContributionsTable';
import LoansTable from './admin/LoansTable';
import SettingsPanel from './admin/SettingsPanel';
import RegisterMemberDialog from './admin/RegisterMemberDialog';
import EditMemberDialog from './admin/EditMemberDialog';
import ContributionForm from './admin/ContributionForm';
import EditContributionForm from './admin/EditContributionForm';
import LoanForm from './admin/LoanForm';
import EditLoanForm from './admin/EditLoanForm';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccentColorToggle } from '@/components/AccentColorToggle';
import {
  createMember,
  readMembers,
  updateMember,
  deleteMember,
} from "@/utils/membersStorage";
import {
  createContribution,
  readContributions,
  updateContribution,
  deleteContribution,
} from "@/utils/contributionsStorage";
import {
  createLoan,
  readLoans,
  updateLoan,
  deleteLoan,
} from "@/utils/loansStorage";
import AddContributionStepper from './AddContributionStepper';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

interface ContributionRecord {
  type: "contribution";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  performedBy: string;
  description?: string;
}

interface LoanRecord {
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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [showEditMemberDialog, setShowEditMemberDialog] = useState(false);
  const [showContributionDialog, setShowContributionDialog] = useState(false);
  const [editingContribution, setEditingContribution] = useState<ContributionRecord | null>(null);
  const [showEditContributionDialog, setShowEditContributionDialog] = useState(false);
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LoanRecord | null>(null);
  const [showEditLoanDialog, setShowEditLoanDialog] = useState(false);
  const [showAddContributionStepper, setShowAddContributionStepper] = useState(false);

  const [membersPage, setMembersPage] = useState(1);
  const [contributionsPage, setContributionsPage] = useState(1);
  const [loansPage, setLoansPage] = useState(1);
  const membersPageSize = 5;
  const contributionsPageSize = 5;
  const loansPageSize = 5;

  useEffect(() => {
    // Load data from local storage on component mount
    const storedMembers = readMembers();
    if (storedMembers) {
      setMembers(storedMembers);
    }

    const storedContributions = readContributions();
    if (storedContributions) {
      setContributions(storedContributions);
    }

    const storedLoans = readLoans();
    if (storedLoans) {
      setLoans(storedLoans);
    }

    // Mock activities for demonstration
    const mockActivities: Activity[] = [
      { id: 1, timestamp: new Date().toISOString(), type: 'member_joined', text: 'A new member joined the community.', adminName: 'Admin User', adminEmail: 'admin@example.com', adminRole: 'admin' },
      { id: 2, timestamp: new Date().toISOString(), type: 'contribution_added', text: 'A member made a contribution.', adminName: 'Admin User', adminEmail: 'admin@example.com', adminRole: 'admin' },
      { id: 3, timestamp: new Date().toISOString(), type: 'loan_approved', text: 'A loan request was approved.', adminName: 'Admin User', adminEmail: 'admin@example.com', adminRole: 'admin' },
    ];
    setActivities(mockActivities);
  }, []);

  // Stats calculation
  const totalMembers = members.length;
  const totalContributions = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
  const averageContribution = totalMembers > 0 ? totalContributions / totalMembers : 0;
  const activeMembers = members.filter(member => member.isActive).length;

  // Handlers for members
  const handleRegisterMember = (memberData: Omit<Member, 'id' | 'totalContributions'>) => {
    const newMember: Member = {
      id: Date.now(), // Generate a unique ID
      ...memberData,
      totalContributions: 0,
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    createMember(newMember); // Save to local storage
    setShowRegisterDialog(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'member_registered',
      text: `${newMember.name} was registered.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setShowEditMemberDialog(true);
  };

  const handleUpdateMember = (memberData: Member) => {
    const updatedMembers = members.map(member =>
      member.id === memberData.id ? memberData : member
    );
    setMembers(updatedMembers);
    updateMember(memberData); // Update in local storage
    setShowEditMemberDialog(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'member_updated',
      text: `${memberData.name}'s profile was updated.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleDeleteMember = (member: Member) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${member.name}?`);
    if (confirmDelete) {
      const updatedMembers = members.filter(m => m.id !== member.id);
      setMembers(updatedMembers);
      deleteMember(member.id); // Delete from local storage
      setActivities(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'member_deleted',
        text: `${member.name} was deleted.`,
        adminName: user.name,
        adminEmail: user.email,
        adminRole: 'admin'
      }]);
    }
  };

  // Handlers for contributions
  const handleAddContribution = (contributionData: Omit<ContributionRecord, 'id' | 'performedBy' | 'memberName'>) => {
    const member = members.find(m => m.id === contributionData.memberId);
    if (!member) {
      alert('Member not found!');
      return;
    }

    const newContribution: ContributionRecord = {
      id: Date.now(), // Generate a unique ID
      ...contributionData,
      type: "contribution",
      memberName: member.name,
      performedBy: user.name,
    };

    const updatedContributions = [...contributions, newContribution];
    setContributions(updatedContributions);
    createContribution(newContribution); // Save to local storage

    // Update member's total contributions
    const updatedMember = { ...member, totalContributions: member.totalContributions + contributionData.amount };
    const updatedMembers = members.map(m => m.id === member.id ? updatedMember : m);
    setMembers(updatedMembers);
    updateMember(updatedMember); // Save updated member to local storage

    setShowContributionDialog(false);
    setShowAddContributionStepper(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'contribution_added',
      text: `${contributionData.amount} XAF contribution added for ${member.name}.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleEditContribution = (record: ContributionRecord) => {
    setEditingContribution(record);
    setShowEditContributionDialog(true);
  };

  const handleUpdateContribution = (contributionData: ContributionRecord) => {
    const updatedContributions = contributions.map(contribution =>
      contribution.id === contributionData.id ? contributionData : contribution
    );
    setContributions(updatedContributions);
    updateContribution(contributionData); // Update in local storage
    setShowEditContributionDialog(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'contribution_updated',
      text: `${contributionData.amount} XAF contribution updated for ${contributionData.memberName}.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleDeleteContribution = (contribution: ContributionRecord) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this contribution of ${contribution.amount} XAF from ${contribution.memberName}?`);
    if (confirmDelete) {
      const updatedContributions = contributions.filter(c => c.id !== contribution.id);
      setContributions(updatedContributions);
      deleteContribution(contribution.id); // Delete from local storage
      setActivities(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'contribution_deleted',
        text: `${contribution.amount} XAF contribution deleted for ${contribution.memberName}.`,
        adminName: user.name,
        adminEmail: user.email,
        adminRole: 'admin'
      }]);
    }
  };

  // Handlers for loans
  const handleAddLoan = (loanData: Omit<LoanRecord, 'id' | 'performedBy' | 'memberName'>) => {
    const member = members.find(m => m.id === loanData.memberId);
    if (!member) {
      alert('Member not found!');
      return;
    }

    const newLoan: LoanRecord = {
      id: Date.now(), // Generate a unique ID
      ...loanData,
      type: "loan",
      memberName: member.name,
      performedBy: user.name,
    };

    const updatedLoans = [...loans, newLoan];
    setLoans(updatedLoans);
    createLoan(newLoan); // Save to local storage
    setShowLoanDialog(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'loan_added',
      text: `${loanData.amount} XAF loan added for ${member.name}.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleEditLoan = (record: LoanRecord) => {
    setEditingLoan(record);
    setShowEditLoanDialog(true);
  };

  const handleUpdateLoan = (loanData: LoanRecord) => {
    const updatedLoans = loans.map(loan =>
      loan.id === loanData.id ? loanData : loan
    );
    setLoans(updatedLoans);
    updateLoan(loanData); // Update in local storage
    setShowEditLoanDialog(false);
    setActivities(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'loan_updated',
      text: `${loanData.amount} XAF loan updated for ${loanData.memberName}.`,
      adminName: user.name,
      adminEmail: user.email,
      adminRole: 'admin'
    }]);
  };

  const handleDeleteLoan = (loan: LoanRecord) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this loan of ${loan.amount} XAF from ${loan.memberName}?`);
    if (confirmDelete) {
      const updatedLoans = loans.filter(l => l.id !== loan.id);
      setLoans(updatedLoans);
      deleteLoan(loan.id); // Delete from local storage
      setActivities(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'loan_deleted',
        text: `${loan.amount} XAF loan deleted for ${loan.memberName}.`,
        adminName: user.name,
        adminEmail: user.email,
        adminRole: 'admin'
      }]);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLogout={onLogout}
          user={user}
          hideUserProfile={true}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Fixed Navbar */}
          <AdminNavbar user={user} onLogout={onLogout} />
          
          {/* Main Content with top padding to account for fixed navbar */}
          <main className="flex-1 p-6 pt-24 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
              {activeTab === 'dashboard' && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                      <p className="text-gray-600 mt-1">Welcome back, manage your community</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <AccentColorToggle />
                      <ThemeToggle />
                    </div>
                  </div>

                  <AdminStatsCards 
                    totalMembers={totalMembers}
                    totalContributions={totalContributions}
                    averageContribution={averageContribution}
                    activeMembers={activeMembers}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AdminRecentActivity activities={activities} />
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowRegisterDialog(true)}
                          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all"
                        >
                          Register New Member
                        </button>
                        <button
                          onClick={() => setShowAddContributionStepper(true)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all"
                        >
                          Add Contribution
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'members' && (
                <MembersTable
                  data={members.slice((membersPage - 1) * membersPageSize, membersPage * membersPageSize)}
                  page={membersPage}
                  totalPages={Math.ceil(members.length / membersPageSize)}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onPageChange={setMembersPage}
                />
              )}

              {activeTab === 'contributions' && (
                <ContributionsTable
                  data={contributions.slice((contributionsPage - 1) * contributionsPageSize, contributionsPage * contributionsPageSize)}
                  page={contributionsPage}
                  totalPages={Math.ceil(contributions.length / contributionsPageSize)}
                  onEdit={handleEditContribution}
                  onDelete={handleDeleteContribution}
                  onPageChange={setContributionsPage}
                />
              )}

              {activeTab === 'loans' && (
                <LoansTable
                  data={loans.slice((loansPage - 1) * loansPageSize, loansPage * loansPageSize)}
                  page={loansPage}
                  totalPages={Math.ceil(loans.length / loansPageSize)}
                  onEdit={handleEditLoan}
                  onDelete={handleDeleteLoan}
                  onPageChange={setLoansPage}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel />
              )}
            </div>
          </main>
        </div>

        {/* Dialogs and Modals */}
        <RegisterMemberDialog
          open={showRegisterDialog}
          onOpenChange={setShowRegisterDialog}
          onSubmit={handleRegisterMember}
        />

        {editingMember && (
          <EditMemberDialog
            open={showEditMemberDialog}
            onOpenChange={setShowEditMemberDialog}
            member={editingMember}
            onSubmit={handleUpdateMember}
          />
        )}

        <AddContributionStepper
          open={showAddContributionStepper}
          onOpenChange={setShowAddContributionStepper}
          members={members}
          onSubmit={handleAddContribution}
        />

        {editingContribution && (
          <EditContributionForm
            open={showEditContributionDialog}
            onOpenChange={setShowEditContributionDialog}
            contribution={editingContribution}
            onSubmit={handleUpdateContribution}
          />
        )}

        {editingLoan && (
          <EditLoanForm
            open={showEditLoanDialog}
            onOpenChange={setShowEditLoanDialog}
            loan={editingLoan}
            onSubmit={handleUpdateLoan}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
