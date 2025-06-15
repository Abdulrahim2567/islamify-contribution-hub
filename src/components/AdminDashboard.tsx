import React, { useState, useEffect } from 'react';
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
import AdminStatsCards from "./admin/AdminStatsCards";
import AdminRecentActivity from "./admin/AdminRecentActivity";
import AdminSettingsForm from "./admin/AdminSettingsForm";
import AdminContributionsTable from "./admin/AdminContributionsTable";
import LoanApplication from "./member/LoanApplication";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { formatCurrency } from "../utils/calculations";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

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
  // Always load members from localStorage. If empty, create/save DEMO_ADMIN as sole member.
  const DEMO_ADMIN_MEMBER: Member = {
    id: 1,
    name: "Admin User",
    email: "admin@islamify.org",
    phone: "",
    registrationFee: 0,
    totalContributions: 0,
    isActive: true,
    loanEligible: false,
    joinDate: (new Date()).toISOString().split("T")[0],
    role: "admin",
  };

  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // On mount: get members from localStorage, fallback only to DEMO_ADMIN_MEMBER.
    const loaded = readMembers();
    if (loaded.length > 0) {
      setMembers(loaded);
    } else {
      setMembers([DEMO_ADMIN_MEMBER]);
      writeMembers([DEMO_ADMIN_MEMBER]);
    }
  }, []);

  useEffect(() => {
    const syncMembers = () => {
      const loaded = readMembers();
      setMembers(loaded.length > 0 ? loaded : [DEMO_ADMIN_MEMBER]);
    };
    window.addEventListener('storage', syncMembers);
    return () => window.removeEventListener('storage', syncMembers);
  }, []);

  // Helper to persist and update (never fallback to mock)
  const persistAndSetMembers = (updateFn) => {
    setMembers(prev => {
      const updated = typeof updateFn === "function" ? updateFn(prev) : updateFn;
      // Ensure DEMO_ADMIN_MEMBER is always present
      const hasDemoAdmin = updated.some(u => u.email === DEMO_ADMIN_MEMBER.email);
      const finalMembers = hasDemoAdmin ? updated : [DEMO_ADMIN_MEMBER, ...updated];
      writeMembers(finalMembers); // save to localStorage
      return finalMembers;
    });
  };

  // Retrieve from localStorage only on mount
  const [activities, setActivities] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Every time activities changes, update localStorage
  useEffect(() => {
    localStorage.setItem(ACTIVITY_LOCALSTORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

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
      // No need to set localStorage here, useEffect handles it
      return updated;
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
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
  const [activityPage, setActivityPage] = useState(1);
  const perPage = 10;
  const [showLoanModal, setShowLoanModal] = useState(false);
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

  // --- Calculate real contribution totals via activities ---
  function getRealMemberContributions(memberId: number): number {
    // Only count "contribution" type activities for this member
    return activities
      .filter(
        (act) =>
          act.type === "add_contribution" &&
          typeof act.text === "string" &&
          (act.text.includes(`"${members.find(m=>m.id===memberId)?.name}"`))
      )
      .reduce((sum, act) => {
        // Extract contribution from text: "Added contribution of 5,000 XAF for "John Doe"..."
        const match = /contribution of ([\d,]+) XAF/.exec(act.text);
        const amt = match ? parseInt(match[1].replace(/,/g, "")) : 0;
        return sum + (isNaN(amt) ? 0 : amt);
      }, 0);
  }

  // For all members: create a map, defaulting to 0 if none
  const memberContributionMap = members.reduce((map, m) => {
    map[m.id] = getRealMemberContributions(m.id);
    return map;
  }, {} as Record<number, number>);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const inactiveMembers = totalMembers - activeMembers;
  const totalContributions = Object.values(memberContributionMap).reduce((sum, v) => sum + v, 0);
  const totalRegistrationFees = members.reduce((sum, m) => sum + m.registrationFee, 0);

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
    // Log in admin activities
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

    // ------------ IMPORTANT PART: update islamify_recent_activities for member dashboards ------------

    // Prepare activity object for member dashboard
    const memberActivity = {
      type: "contribution",
      amount,
      memberId,
      memberName: member?.name || "",
      date,
      performedBy: user.name,
      description: description || "",
    };

    // Read recent activities (as member dashboard expects)
    const MEMBER_ACTIVITY_KEY = "islamify_recent_activities";
    let recentActivities: any[] = [];
    try {
      const stored = localStorage.getItem(MEMBER_ACTIVITY_KEY);
      if (stored) {
        recentActivities = JSON.parse(stored);
      }
    } catch {}
    // Prepend new activity, keep to a max size if desired
    recentActivities = [memberActivity, ...recentActivities];
    localStorage.setItem(MEMBER_ACTIVITY_KEY, JSON.stringify(recentActivities));

    // ------------ END IMPORTANT PART ------------

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

  // PAGINATION LOGIC FOR ACTIVITIES
  const paginatedActivities = activities.slice((activityPage - 1) * perPage, activityPage * perPage);
  const totalPages = Math.ceil(activities.length / perPage);

  // Handler for pagination clicks
  const handleActivityPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setActivityPage(page);
  };

  // For admin, find "self" as a member record, e.g., by email
  const thisAdminMember = members.find((m) => m.email === user.email || m.id === user.id);

  // For loan, use sum of admin's contributions (like member dashboard logic)
  const adminMemberId = thisAdminMember?.id ?? user.id;
  // Fallback: If no member record, default contributions to 0
  const adminContributions = thisAdminMember
    ? memberContributionMap[thisAdminMember.id] || 0
    : 0;
  const adminMaxLoanAmount = adminContributions * 3;

  // Allow admin to apply for loan if they are found as a member and eligible
  const adminCanApplyForLoan = !!thisAdminMember?.loanEligible;

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
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeTab === "dashboard" && "Dashboard"}
                      {activeTab === "members" && "Members"}
                      {activeTab === "contributions" && "Manage Contributions"}
                      {activeTab === "settings" && "Settings"}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Welcome back, {user.name || user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'dashboard' && (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your association finances</p>
                  </div>
                  {/* Stats Cards */}
                  <AdminStatsCards
                    totalMembers={totalMembers}
                    activeMembers={activeMembers}
                    inactiveMembers={inactiveMembers}
                    totalContributions={totalContributions}
                    totalRegistrationFees={totalRegistrationFees}
                  />

                  {/* Allow admin to apply for a loan (just like member dashboard) */}
                  {adminCanApplyForLoan && (
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
                      memberId={String(adminMemberId)}
                      maxAmount={adminMaxLoanAmount}
                      onSubmit={data => {
                        setShowLoanModal(false);
                        // Store the application in localStorage or activities (not specified, just notify for now)
                        // Optionally, you can handle storage as an enhancement.
                        // Show a toast notification
                        toast({
                          title: "Loan Application Submitted",
                          description: `Your application for ${formatCurrency(data.amount)} is pending.`,
                        });
                      }}
                      onCancel={() => setShowLoanModal(false)}
                    />
                  )}

                  {/* Recent Activity */}
                  <AdminRecentActivity
                    activities={activities}
                    paginatedActivities={paginatedActivities}
                    totalPages={totalPages}
                    activityPage={activityPage}
                    onActivityPageChange={handleActivityPageChange}
                  />
                </>
              )}

              {activeTab === 'members' && (
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
                      members={members.map(m => ({
                        ...m,
                        totalContributions: memberContributionMap[m.id] || 0
                      }))}
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

              {activeTab === 'contributions' && user.role === "admin" && (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AdminContributionsTable />
                </React.Suspense>
              )}

              {activeTab === 'settings' && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage association configuration</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8">
                    <AdminSettingsForm settings={settings} setSettings={setSettings} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
