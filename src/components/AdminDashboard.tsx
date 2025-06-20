import React, { useState, useEffect } from 'react';
import { Member, Activity, ContributionRecord, LoanRecord } from './admin/types';
import AdminNavbar from './admin/AdminNavbar';
import AdminStatsCards from './admin/AdminStatsCards';
import AdminRecentActivity from './admin/AdminRecentActivity';
import ContributionsTable from './admin/ContributionsTable';
import RegisterMemberDialog from './admin/RegisterMemberDialog';
import EditMemberDialog from './admin/EditMemberDialog';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AccentColorToggle } from '@/components/ui/AccentColorToggle';
import {
  readMembers,
  writeMembers,
} from "@/utils/membersStorage";
import {
  readContributions,
  writeContributions,
} from "@/utils/contributionsStorage";
import {
  readLoans,
  writeLoans,
} from "@/utils/loansStorage";
import AddContributionStepper from './admin/AddContributionStepper';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
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
  const [editingContribution, setEditingContribution] = useState<ContributionRecord | null>(null);
  const [showEditContributionDialog, setShowEditContributionDialog] = useState(false);
  const [showAddContributionStepper, setShowAddContributionStepper] = useState(false);

  const [membersPage, setMembersPage] = useState(1);
  const [contributionsPage, setContributionsPage] = useState(1);
  const [loansPage, setLoansPage] = useState(1);
  const membersPageSize = 5;
  const contributionsPageSize = 5;
  const loansPageSize = 5;

  const [newMember, setNewMember] = useState<{ name: string; email: string; phone: string; role: "member" | "admin" }>({
    name: '',
    email: '',
    phone: '',
    role: 'member'
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const memberData: Omit<Member, 'id' | 'totalContributions'> = {
      ...newMember,
      registrationFee: 5000,
      isActive: true,
      loanEligible: true,
      joinDate: new Date().toISOString(),
    };
    handleRegisterMember(memberData);
    setNewMember({ name: '', email: '', phone: '', role: 'member' });
  };

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
  const activeMembers = members.filter(member => member.isActive).length;
  const inactiveMembers = totalMembers - activeMembers;
  const totalRegistrationFees = members.length * 5000; // Assuming 5000 XAF per member

  // Handlers for members
  const handleRegisterMember = (memberData: Omit<Member, 'id' | 'totalContributions'>) => {
    const newMember: Member = {
      id: Date.now(), // Generate a unique number ID
      ...memberData,
      totalContributions: 0,
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    writeMembers(updatedMembers); // Save to local storage
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
    writeMembers(updatedMembers); // Update in local storage
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
      writeMembers(updatedMembers); // Delete from local storage
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
      id: Date.now(), // Generate a unique number ID
      ...contributionData,
      memberName: member.name,
      performedBy: user.name,
    };

    const updatedContributions = [...contributions, newContribution];
    setContributions(updatedContributions);
    writeContributions(updatedContributions); // Save to local storage

    // Update member's total contributions
    const updatedMember = { ...member, totalContributions: member.totalContributions + contributionData.amount };
    const updatedMembers = members.map(m => m.id === member.id ? updatedMember : m);
    setMembers(updatedMembers);
    writeMembers(updatedMembers); // Save updated member to local storage

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
    writeContributions(updatedContributions); // Update in local storage
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
      writeContributions(updatedContributions); // Delete from local storage
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
          <main className="flex-1 p-6 pt-24 pl-8 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
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
                    activeMembers={activeMembers}
                    inactiveMembers={inactiveMembers}
                    totalRegistrationFees={totalRegistrationFees}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AdminRecentActivity 
                      activities={activities}
                      paginatedActivities={activities.slice(0, 5)}
                      totalPages={Math.ceil(activities.length / 5)}
                      activityPage={1}
                      onActivityPageChange={() => {}}
                    />
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowRegisterDialog(true)}
                          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-full font-medium hover:from-blue-600 hover:to-green-600 transition-all"
                        >
                          Register New Member
                        </button>
                        <button
                          onClick={() => setShowAddContributionStepper(true)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 px-4 rounded-full font-medium hover:from-emerald-600 hover:to-blue-600 transition-all"
                        >
                          Add Contribution
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'members' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Members</h2>
                  <p className="text-gray-600">Member management will be implemented here.</p>
                </div>
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Loans</h2>
                  <p className="text-gray-600">Loan management will be implemented here.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                  <p className="text-gray-600">Settings panel will be implemented here.</p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Dialogs and Modals */}
        <RegisterMemberDialog
          open={showRegisterDialog}
          onOpenChange={setShowRegisterDialog}
          newMember={newMember}
          setNewMember={setNewMember}
          onSubmit={handleRegisterSubmit}
        />

        {editingMember && (
          <EditMemberDialog
            open={showEditMemberDialog}
            onOpenChange={setShowEditMemberDialog}
            member={editingMember}
            onSave={(id, data) => {
              const updatedMember = { ...editingMember, ...data };
              handleUpdateMember(updatedMember);
            }}
          />
        )}

        <AddContributionStepper
          open={showAddContributionStepper}
          onOpenChange={setShowAddContributionStepper}
          members={members}
          onSubmit={handleAddContribution}
        />

        {editingContribution && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Contribution</h3>
              <p className="text-gray-600">Edit contribution form will be implemented here.</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditContributionDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-full border border-gray-300 hover:border-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
