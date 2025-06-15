import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Plus, Search, Eye, UserCheck, DollarSign, UserX, Trash2, ToggleLeft, ToggleRight, Settings, Grid, List, Mail, Phone, User, Shield, CreditCard, TrendingUp, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentColorToggle } from "@/components/ui/AccentColorToggle";
import { useTheme } from "@/components/ui/ThemeProvider";
import MemberCard from "./admin/MemberCard";
import MemberTable from "./admin/MemberTable";
import MemberDetailModal from "./admin/MemberDetailModal";
import RegisterMemberDialog from "./admin/RegisterMemberDialog";
import SuccessModal from "./admin/SuccessModal";
import ContributionForm from "./admin/ContributionForm";
import type { Member } from "./admin/types";

// Mock data for members
const MOCK_MEMBERS: Member[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+237123456789",
    registrationFee: 5000,
    totalContributions: 25000,
    isActive: true,
    loanEligible: true,
    joinDate: "2024-01-15",
    role: "member"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+237987654321",
    registrationFee: 5000,
    totalContributions: 18000,
    isActive: true,
    loanEligible: false,
    joinDate: "2024-02-20",
    role: "member"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+237555666777",
    registrationFee: 5000,
    totalContributions: 32000,
    isActive: false,
    loanEligible: true,
    joinDate: "2024-01-10",
    role: "member"
  }
];

// Add this type for the new member state
type NewMember = {
  name: string;
  email: string;
  phone: string;
  role: "member" | "admin";
};

const AdminDashboard = ({ user, onLogout }) => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [newMember, setNewMember] = useState<NewMember>({
    name: '',
    email: '',
    phone: '',
    role: 'member'
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [targetMemberId, setTargetMemberId] = useState<number|null>(null);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleRegisterMember = (e) => {
    e.preventDefault();
    const password = generatePassword();
    const member: Member = {
      id: members.length + 1,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role, // Now always of type "member" | "admin"
      registrationFee: 5000,
      totalContributions: 0,
      isActive: true,
      loanEligible: false,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setMembers([...members, member]);
    setGeneratedPassword(password);
    setShowRegisterModal(false);
    setShowSuccessModal(true);
    setNewMember({ name: '', email: '', phone: '', role: 'member' });
  };

  const toggleMemberStatus = (id) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    ));
    toast({
      title: "Member Status Updated",
      description: "Member status has been changed successfully",
    });
  };

  const toggleLoanEligibility = (id) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, loanEligible: !member.loanEligible } : member
    ));
    toast({
      title: "Loan Eligibility Updated",
      description: "Member loan eligibility has been changed successfully",
    });
  };

  const deleteMember = (id) => {
    const member = members.find(m => m.id === id);
    if (window.confirm(`Are you sure you want to delete ${member?.name}? This action cannot be undone.`)) {
      setMembers(members.filter(member => member.id !== id));
      toast({
        title: "Member Deleted",
        description: "Member has been removed from the system",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributions, 0);
  const totalRegistrationFees = members.reduce((sum, m) => sum + m.registrationFee, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const { theme, accent } = useTheme();

  // Helper for accent classes
  const accentGradient =
    accent === "blue"
      ? "from-blue-500 to-blue-700"
      : accent === "indigo"
      ? "from-indigo-500 to-indigo-700"
      : accent === "violet"
      ? "from-violet-500 to-violet-700"
      : "from-emerald-500 to-emerald-700";

  // Handle admin adding contribution to a member
  const handleOpenAddContribution = () => {
    setShowContributionModal(false);
    setTargetMemberId(null);
  };
  const openContributionModalFor = (memberId: number) => {
    setTargetMemberId(memberId);
    setShowContributionModal(true);
  };

  const handleAddContribution = ({ amount, description }: { amount: number; description?: string }) => {
    if (!targetMemberId) return;
    setMembers(members =>
      members.map(m =>
        m.id === targetMemberId
          ? { ...m, totalContributions: m.totalContributions + amount }
          : m
      )
    );
    setShowContributionModal(false);
    setTargetMemberId(null);
    toast({
      title: "Contribution Added",
      description: `Added ${amount.toLocaleString()} XAF contribution.`,
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent transition-colors`}>Islamify</h1>
              <nav className="hidden md:flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentView === item.id
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-2">
              <ThemeToggle/>
              <span className="text-sm text-gray-600 dark:text-gray-100">
                Welcome, {user.name}
              </span>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-100 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your association finances</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalContributions.toLocaleString()} XAF</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Fees</p>
                    <p className="text-2xl font-bold text-gray-900">{totalRegistrationFees.toLocaleString()} XAF</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Funds</p>
                    <p className="text-2xl font-bold text-gray-900">{(totalContributions + totalRegistrationFees).toLocaleString()} XAF</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              </div>
            </div>
          </>
        )}

        {currentView === 'members' && (
          <>
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Members Management</h1>
                <p className="text-gray-600">Manage association members and their contributions</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('card')}
                    className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                </div>
                {/* Add Contribution Button */}
                <button
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all"
                  onClick={() => {
                    // Open modal and let admin select a member in the modal
                    setShowContributionModal(true);
                    setTargetMemberId(null);
                  }}
                  type="button"
                >
                  <DollarSign size={18} />
                  Add Contribution
                </button>
                <RegisterMemberDialog
                  open={showRegisterModal}
                  onOpenChange={setShowRegisterModal}
                  newMember={newMember}
                  setNewMember={setNewMember}
                  onSubmit={handleRegisterMember}
                />
              </div>
            </div>

            {/* Contribution Modal (Step 1: Select member, Step 2: Form) */}
            {showContributionModal && (
              !targetMemberId ? (
                // Member selection modal
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                  <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Select Member</h2>
                      <button
                        onClick={() => { setShowContributionModal(false); setTargetMemberId(null); }}
                        className="text-gray-400 hover:text-gray-600"
                        type="button"
                        aria-label="Close"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {members
                        .filter(m => m.role !== 'admin')
                        .map(m => (
                        <button
                          key={m.id}
                          onClick={() => setTargetMemberId(m.id)}
                          className="w-full text-left px-4 py-3 border rounded-lg hover:bg-emerald-50 flex justify-between items-center"
                        >
                          <span className="font-semibold text-gray-900">{m.name}</span>
                          <span className="text-xs text-gray-500">{m.email}</span>
                        </button>
                      ))}
                      {members.filter(m => m.role !== 'admin').length === 0 && (
                        <div className="py-6 text-center text-gray-400">
                          No regular members found.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Contribution form for selected member
                <ContributionForm
                  memberName={members.find(m => m.id === targetMemberId)?.name ?? "Member"}
                  onSubmit={handleAddContribution}
                  onCancel={() => {
                    setShowContributionModal(false);
                    setTargetMemberId(null);
                  }}
                />
              )
            )}
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Search members..."
                />
              </div>
            </div>

            {/* Members Display */}
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onView={setSelectedMember}
                    onStatusToggle={toggleMemberStatus}
                    onLoanToggle={toggleLoanEligibility}
                    onDelete={deleteMember}
                  />
                ))}
              </div>
            ) : (
              <MemberTable
                members={members}
                onView={setSelectedMember}
                onStatusToggle={toggleMemberStatus}
                onLoanToggle={toggleLoanEligibility}
                onDelete={deleteMember}
                searchTerm={searchTerm}
              />
            )}
          </>
        )}

        {currentView === 'settings' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage association configuration</p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Add your settings update logic here (e.g. call onUpdateSettings)
                  // If using state, add it here, else keep as a placeholder.
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Association Name
                  </label>
                  <input
                    type="text"
                    // value and onChange logic here; omitted as settings are not fully defined in the current file
                    className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Registration Fee (XAF)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Maximum Loan Multiplier
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-transparent dark:bg-gray-950 text-gray-900 dark:text-white"
                    required
                    min="1"
                    max="10"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Members can borrow up to this many times their savings amount
                  </p>
                </div>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
                >
                  <Save size={20} />
                  <span>Save Settings</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />

      {/* Success Modal */}
      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        generatedPassword={generatedPassword}
      />
    </div>
  );
};

export default AdminDashboard;
