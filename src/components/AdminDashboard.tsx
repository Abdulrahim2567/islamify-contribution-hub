import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Plus, Search, Eye, UserCheck, DollarSign, UserX, Trash2, ToggleLeft, ToggleRight, Settings, Grid, List, Mail, Phone, User, Shield, CreditCard, TrendingUp, X, Save, History } from "lucide-react";
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
import type { Member } from "./admin/types";
import AddContributionStepper from "./admin/AddContributionStepper";
import { readMembers, writeMembers } from "../utils/membersStorage";

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

const USERS_LOCALSTORAGE_KEY = 'islamify_users';
const ACTIVITY_LOCALSTORAGE_KEY = 'islamify_admin_activities';

// Helper to update users in localStorage (also called by Index)
function persistUsers(users) {
  localStorage.setItem(USERS_LOCALSTORAGE_KEY, JSON.stringify(users));
}

function readActivities() {
  try {
    const stored = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}
function writeActivities(activities: any[]) {
  localStorage.setItem(ACTIVITY_LOCALSTORAGE_KEY, JSON.stringify(activities));
}

const AdminDashboard = ({ user, onLogout, onNewUser, users }) => {
  // Replace default members with loaded/persisted state
  const [members, setMembers] = useState<Member[]>([]);

  // On mount, always get members from localStorage (if empty, fall back to MOCK_MEMBERS!)
  useEffect(() => {
    const loaded = readMembers();
    if (loaded.length > 0) {
      setMembers(loaded);
    } else {
      setMembers(MOCK_MEMBERS);
      writeMembers(MOCK_MEMBERS);
    }
  }, []);

  // On *every* readMembers() change (from add/edit/delete), update live.
  useEffect(() => {
    const syncMembers = () => {
      const loaded = readMembers();
      setMembers(loaded.length > 0 ? loaded : MOCK_MEMBERS);
    };
    window.addEventListener('storage', syncMembers); // Handles changes from other tabs, too.
    return () => window.removeEventListener('storage', syncMembers);
  }, []);

  // Helper to always persist after updates (members)
  const persistAndSetMembers = (updateFn) => {
    setMembers(prev => {
      const updated = typeof updateFn === "function" ? updateFn(prev) : updateFn;
      writeMembers(updated);
      return updated;
    });
  };

  // Helper to always persist after updates (activities)
  const persistAndSetActivities = (activityOrUpdateFn) => {
    setActivities(prev => {
      let updated;
      if (typeof activityOrUpdateFn === "function") {
        updated = activityOrUpdateFn(prev);
      } else {
        // Accept single activity or array
        updated = Array.isArray(activityOrUpdateFn)
          ? activityOrUpdateFn
          : [activityOrUpdateFn, ...prev];
      }
      writeActivities(updated);
      return updated;
    });
  };

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
  const [settings, setSettings] = useState({
    associationName: "Islamify",
    registrationFee: 5000,
    maxLoanMultiplier: 3,
  });
  const [cardsShouldAnimate, setCardsShouldAnimate] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const { toast } = useToast();
  const [showAddContributionStepper, setShowAddContributionStepper] = useState(false);

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
    const id = Date.now(); // Use timestamp for uniqueness
    const member = {
      id,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      role: newMember.role,
      registrationFee: 5000,
      totalContributions: 0,
      isActive: true,
      loanEligible: false,
      joinDate: new Date().toISOString().split('T')[0]
    };
    persistAndSetMembers([...members, member]);
    setGeneratedPassword(password);

    // Update localStorage users for login
    let persistedUsers = [];
    try {
      const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
      if (fromStorage) persistedUsers = JSON.parse(fromStorage) || [];
    } catch {}
    // User for login should match Index.tsx login format
    const loginUser = {
      id,
      email: newMember.email,
      password,
      role: newMember.role,
      name: newMember.name,
      needsPasswordChange: true // must change password on first login
    };
    const updatedUsers = [...persistedUsers, loginUser];
    persistUsers(updatedUsers);
    // Optionally notify Index of user update (for state sync in SPA)
    if (onNewUser) onNewUser([...users, loginUser]);

    setShowRegisterModal(false);
    setShowSuccessModal(true);
    setNewMember({ name: '', email: '', phone: '', role: 'member' });

    // Activity log with admin name/email
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "add_member",
      text: `Added new member "${member.name}" (${member.email}) as ${member.role}`,
      color: "emerald",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
  };

  const toggleMemberStatus = (id) => {
    persistAndSetMembers(members =>
      members.map(member => 
        member.id === id ? { ...member, isActive: !member.isActive } : member
      )
    );
    const member = members.find(m => m.id === id);
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "toggle_status",
      text: `Changed status of "${member?.name}" to ${member?.isActive ? "Inactive" : "Active"}`,
      color: "orange",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
    toast({
      title: "Member Status Updated",
      description: "Member status has been changed successfully",
    });
  };

  const toggleLoanEligibility = (id) => {
    persistAndSetMembers(members =>
      members.map(member => 
        member.id === id ? { ...member, loanEligible: !member.loanEligible } : member
      )
    );
    const member = members.find(m => m.id === id);
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "loan_eligibility",
      text: `Changed loan eligibility for "${member?.name}" to ${member?.loanEligible ? "Disabled" : "Enabled"}`,
      color: "indigo",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
    toast({
      title: "Loan Eligibility Updated",
      description: "Member loan eligibility has been changed successfully",
    });
  };

  const deleteMember = (id) => {
    const member = members.find(m => m.id === id);
    if (window.confirm(`Are you sure you want to delete ${member?.name}? This action cannot be undone.`)) {
      persistAndSetMembers(members => members.filter(member => member.id !== id));
      persistAndSetActivities({
        id: Date.now() + Math.random(),
        timestamp: getNowString(),
        type: "delete_member",
        text: `Deleted member "${member?.name}"`,
        color: "red",
        adminName: user.name,
        adminEmail: user.email,
        adminRole: user.role,
      });
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
  const inactiveMembers = totalMembers - activeMembers;
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
    const member = members.find(m => m.id === targetMemberId);
    persistAndSetMembers(members =>
      members.map(m =>
        m.id === targetMemberId
          ? { ...m, totalContributions: m.totalContributions + amount }
          : m
      )
    );
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "add_contribution",
      text: `Added contribution of ${amount.toLocaleString()} XAF for "${member?.name}"${description ? ` (${description})` : ""}`,
      color: "cyan",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
    setShowContributionModal(false);
    setTargetMemberId(null);
    toast({
      title: "Contribution Added",
      description: `Added ${amount.toLocaleString()} XAF contribution.`,
    });
  };

  const handleAddContributionStepper = ({
    memberId,
    amount,
    type,
    date,
    description,
  }: {
    memberId: number;
    amount: number;
    type: "contribution";
    date: string;
    description?: string;
  }) => {
    const member = members.find(m => m.id === memberId);
    persistAndSetMembers((members) =>
      members.map((m) =>
        m.id === memberId
          ? { ...m, totalContributions: m.totalContributions + amount }
          : m
      )
    );
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "add_contribution",
      text: `Added contribution of ${amount.toLocaleString()} XAF for "${member?.name}"${description ? ` (${description})` : ""}`,
      color: "cyan",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
    setShowAddContributionStepper(false);
    setTargetMemberId(null);
    toast({
      title: "Contribution Added",
      description: `Added ${amount.toLocaleString()} XAF contribution.`,
    });
  };

  // NEW: Change role handler
  const handleChangeRole = (id: number, newRole: "member" | "admin") => {
    persistAndSetMembers(members =>
      members.map(m =>
        m.id === id ? { ...m, role: newRole } : m
      )
    );

    // Update user object in localStorage USERS_LOCALSTORAGE_KEY
    let persistedUsers = [];
    try {
      const fromStorage = localStorage.getItem(USERS_LOCALSTORAGE_KEY);
      if (fromStorage) persistedUsers = JSON.parse(fromStorage) || [];
    } catch {}
    // Find the member for the user
    const member = members.find(m => m.id === id);
    if (member) {
      // Find the index of the user matching the member's email.
      const updatedUsers = persistedUsers.map(u =>
        (u.email === member.email || u.id === id)
          ? { ...u, role: newRole }
          : u
      );
      persistUsers(updatedUsers);
      // Update parent state if needed (triggers re-render for login, etc)
      if (onNewUser) onNewUser(updatedUsers);
      persistAndSetActivities({
        id: Date.now() + Math.random(),
        timestamp: getNowString(),
        type: "change_role",
        text: `Changed role for "${member.name}" to "${newRole}"`,
        color: "amber",
        adminName: user.name,
        adminEmail: user.email,
        adminRole: user.role,
      });
    }

    toast({
      title: "Role Updated",
      description: `Member role changed to ${newRole}`,
    });
  };

  // Edit member handler
  const handleEditMember = (id: number, data: { name: string; email: string; phone: string }) => {
    persistAndSetMembers(members =>
      members.map(m =>
        m.id === id
          ? { ...m, ...data }
          : m
      )
    );
    persistAndSetActivities({
      id: Date.now() + Math.random(),
      timestamp: getNowString(),
      type: "edit_member",
      text: `Edited details for "${data.name}" (${data.email})`,
      color: "blue",
      adminName: user.name,
      adminEmail: user.email,
      adminRole: user.role,
    });
    toast({
      title: "Member Updated",
      description: "Member details updated successfully",
    });
  };

  const getNowString = () => {
    const d = new Date();
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
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
                    <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Active: {activeMembers} &bull; Inactive: {inactiveMembers}
                    </p>
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
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                  <ol className="space-y-2">
                    {activities.map((act) => (
                      <li key={act.id} className="flex items-start gap-2">
                        <History className="mt-0.5 w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className={`mt-1 w-2 h-2 rounded-full bg-${act.color}-500`} />
                        <span>
                          <span className="block text-sm text-gray-800">
                            <span className="font-semibold text-emerald-700">{act.adminName || "Admin"}</span>{' '}
                            <span className="text-gray-600">({act.adminEmail || ""})</span> — {act.text}
                          </span>
                          <span className="block text-xs text-gray-400">{act.timestamp}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
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
                    onClick={() => {
                      // Only animate if switching from another mode to "table"
                      setViewMode('table');
                      setCardsShouldAnimate(false);
                    }}
                    className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('card');
                      setCardsShouldAnimate(true);
                      // Reset animation after 700ms (time for anims to finish)
                      setTimeout(() => setCardsShouldAnimate(false), 700);
                    }}
                    className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                </div>
                {/* Add Contribution Button (opens stepper) */}
                <button
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105"
                  onClick={() => setShowAddContributionStepper(true)}
                  type="button"
                  aria-label="Add contribution"
                >
                  <DollarSign size={20} />
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

            {/* Add Contribution Stepper Modal */}
            <AddContributionStepper
              open={showAddContributionStepper}
              onOpenChange={setShowAddContributionStepper}
              members={members}
              onSubmit={handleAddContributionStepper}
            />

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
                {filteredMembers.map((member, idx) => (
                  <div
                    key={member.id}
                    className={
                      cardsShouldAnimate
                        ? "animate-fade-in animate-scale-in"
                        : ""
                    }
                    style={{
                      animationDelay: cardsShouldAnimate
                        ? (idx * 70) + "ms"
                        : undefined,
                      animationFillMode: cardsShouldAnimate ? "both" : undefined,
                    }}
                  >
                    <MemberCard
                      member={member}
                      currentUser={user}
                      onView={setSelectedMember}
                      onStatusToggle={toggleMemberStatus}
                      onLoanToggle={toggleLoanEligibility}
                      onDelete={deleteMember}
                      onRoleChange={handleChangeRole}
                      onEdit={handleEditMember}
                    />
                  </div>
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
                onRoleChange={handleChangeRole}
                onEdit={handleEditMember}
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
                  // Settings update logic placeholder
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Association Name
                  </label>
                  <input
                    type="text"
                    value={settings.associationName}
                    onChange={(e) => setSettings(s => ({ ...s, associationName: e.target.value }))}
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
                    value={settings.registrationFee}
                    onChange={(e) => setSettings(s => ({ ...s, registrationFee: Number(e.target.value) }))}
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
                    value={settings.maxLoanMultiplier}
                    onChange={(e) => setSettings(s => ({ ...s, maxLoanMultiplier: Number(e.target.value) }))}
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
