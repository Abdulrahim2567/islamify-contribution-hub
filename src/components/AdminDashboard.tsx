import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Plus, Search, Eye, UserCheck, DollarSign, UserX, Trash2, ToggleLeft, ToggleRight, Settings, Grid, List, Mail, Phone, User, Shield, CreditCard, TrendingUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentColorToggle } from "@/components/ui/AccentColorToggle";
import { useTheme } from "@/components/ui/ThemeProvider";

// Mock data for members
const MOCK_MEMBERS = [
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

const AdminDashboard = ({ user, onLogout }) => {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member'
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
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
    const member = {
      id: members.length + 1,
      ...newMember,
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

  const renderMemberCard = (member) => {
    const maxLoanAmount = member.totalContributions * 3;
    
    return (
      <div key={member.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
            <p className="text-sm text-gray-500">{member.phone}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            member.role === 'admin' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {member.role}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Contributions:</span>
            <span className="font-medium">{member.totalContributions.toLocaleString()} XAF</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Max Loan:</span>
            <span className="font-medium">{maxLoanAmount.toLocaleString()} XAF</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            member.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {member.isActive ? 'Active' : 'Inactive'}
          </span>
          
          {/* Status switch */}
          <div className="flex items-center space-x-1">
            <Switch
              checked={member.isActive}
              onCheckedChange={() => toggleMemberStatus(member.id)}
              className={`mr-2 data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-400`}
            />
            <span className={`text-xs ${member.isActive ? "text-green-700" : "text-gray-400"}`}>
              {member.isActive ? "Enabled" : "Disabled"}
            </span>
          </div>
          
          <button
            onClick={() => toggleLoanEligibility(member.id)}
            className="flex items-center space-x-1"
          >
            {member.loanEligible ? (
              <ToggleRight className="w-4 h-4 text-green-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-gray-400" />
            )}
            <span className={`text-xs ${member.loanEligible ? 'text-green-600' : 'text-gray-400'}`}>
              Loan {member.loanEligible ? 'Enabled' : 'Disabled'}
            </span>
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedMember(member)}
            className="text-emerald-600 hover:text-emerald-900 p-1"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => toggleMemberStatus(member.id)}
            className={`p-1 ${member.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
          >
            <UserX size={16} />
          </button>
          {member.role !== 'admin' && (
            <button
              onClick={() => deleteMember(member.id)}
              className="text-red-600 hover:text-red-900 p-1"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    );
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
                <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
                  <DialogTrigger asChild>
                    <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105">
                      <Plus size={20} />
                      <span>Add Member</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-white" />
                      </div>
                      <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Add New Member</DialogTitle>
                      <DialogDescription>Register a new member to the association</DialogDescription>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-emerald-800">
                        <strong>Registration Fee:</strong> 5,000 XAF
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        A default password will be generated and must be changed on first login.
                      </p>
                    </div>

                    <form onSubmit={handleRegisterMember} className="space-y-6">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <Input
                            className="pl-10"
                            value={newMember.name}
                            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <Input
                            type="email"
                            className="pl-10"
                            value={newMember.email}
                            onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <Input
                            className="pl-10"
                            value={newMember.phone}
                            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-3">Role</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setNewMember({...newMember, role: 'member'})}
                            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                              newMember.role === 'member'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <User size={20} />
                            <span>Member</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewMember({...newMember, role: 'admin'})}
                            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                              newMember.role === 'admin'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Shield size={20} />
                            <span>Admin</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowRegisterModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                        >
                          Add Member
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

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
                {filteredMembers.map(renderMemberCard)}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributions</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Loan</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Eligible</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMembers.map((member) => {
                        const maxLoanAmount = member.totalContributions * 3;

                        return (
                          <tr key={member.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                                <div className="text-sm text-gray-500">{member.phone}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                member.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {member.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {member.totalContributions.toLocaleString()} XAF
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {maxLoanAmount.toLocaleString()} XAF
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Switch
                                checked={member.isActive}
                                onCheckedChange={() => toggleMemberStatus(member.id)}
                                className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-400"
                              />
                              <span className={`ml-2 text-xs ${member.isActive ? "text-green-700" : "text-gray-400"}`}>
                                {member.isActive ? "Enabled" : "Disabled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleLoanEligibility(member.id)}
                                className="flex items-center space-x-1"
                              >
                                {member.loanEligible ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                                )}
                                <span className={`text-xs ${member.loanEligible ? 'text-green-600' : 'text-gray-400'}`}>
                                  {member.loanEligible ? 'Enabled' : 'Disabled'}
                                </span>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => setSelectedMember(member)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => toggleMemberStatus(member.id)}
                                className={`${member.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                              >
                                <UserX size={16} />
                              </button>
                              {member.role !== 'admin' && (
                                <button
                                  onClick={() => deleteMember(member.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {currentView === 'settings' && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
            <AccentColorToggle />
            <p className="text-gray-500">Settings panel coming soon...</p>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{selectedMember.name}</h2>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Email: {selectedMember.email}</p>
                  <p className="text-sm text-gray-600">Phone: {selectedMember.phone}</p>
                  <p className="text-sm text-gray-600">
                    Joined: {new Date(selectedMember.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Financial Summary</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Contributions: {selectedMember.totalContributions.toLocaleString()} XAF
                  </p>
                  <p className="text-sm text-gray-600">
                    Registration Fee: {selectedMember.registrationFee.toLocaleString()} XAF
                  </p>
                  <p className="text-sm text-gray-600">
                    Max Loan: {(selectedMember.totalContributions * 3).toLocaleString()} XAF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">✅ Registration Successful!</DialogTitle>
            <DialogDescription className="text-center">
              The member has been registered successfully.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-green-50 p-4 rounded-lg space-y-2">
            <p className="text-sm"><strong>Default Password:</strong></p>
            <div className="bg-white p-3 rounded border border-green-200 font-mono text-center text-lg">
              {generatedPassword}
            </div>
            <p className="text-sm text-green-700">
              Please share this password with the member. They will be required to change it on first login.
            </p>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
