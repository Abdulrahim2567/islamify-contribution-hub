
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Plus, Grid, List, Search, Eye, EyeOff, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    setMembers(members.filter(member => member.id !== id));
    toast({
      title: "Member Deleted",
      description: "Member has been removed from the system",
      variant: "destructive",
    });
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const totalContributions = members.reduce((sum, m) => sum + m.totalContributions, 0);
  const totalRegistrationFees = members.reduce((sum, m) => sum + m.registrationFee, 0);

  return (
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
                <h1 className="text-2xl font-bold text-gray-800">Islamify Admin</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-3xl font-bold text-blue-600">{totalMembers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-3xl font-bold text-green-600">{activeMembers}</p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Contributions</p>
                  <p className="text-3xl font-bold text-purple-600">{totalContributions.toLocaleString()} XAF</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">₣</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registration Fees</p>
                  <p className="text-3xl font-bold text-orange-600">{totalRegistrationFees.toLocaleString()} XAF</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">₣</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Management */}
        <Card className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Member Management</CardTitle>
                <CardDescription>Manage your association members</CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Register Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Member</DialogTitle>
                      <DialogDescription>
                        Add a new member to the association
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterMember} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newMember.email}
                          onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={newMember.phone}
                          onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={newMember.role} onValueChange={(value) => setNewMember({...newMember, role: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Registration Fee:</strong> 5,000 XAF
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          A default password will be generated and must be changed on first login.
                        </p>
                      </div>
                      <Button type="submit" className="w-full">
                        Register Member
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-sm text-gray-600">{member.phone}</p>
                        </div>
                        <Badge variant={member.isActive ? 'default' : 'secondary'}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Contributions:</span>
                          <span className="font-medium">{member.totalContributions.toLocaleString()} XAF</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Joined:</span>
                          <span>{member.joinDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={member.isActive}
                            onCheckedChange={() => toggleMemberStatus(member.id)}
                          />
                          <span className="text-sm">Active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={member.loanEligible}
                            onCheckedChange={() => toggleLoanEligibility(member.id)}
                          />
                          <span className="text-sm">Loan</span>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Member</th>
                      <th className="text-left p-4">Contact</th>
                      <th className="text-left p-4">Contributions</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Loan Eligible</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-gray-600">Joined: {member.joinDate}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{member.email}</div>
                            <div className="text-gray-600">{member.phone}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{member.totalContributions.toLocaleString()} XAF</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={member.isActive}
                              onCheckedChange={() => toggleMemberStatus(member.id)}
                            />
                            <Badge variant={member.isActive ? 'default' : 'secondary'}>
                              {member.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <Switch
                            checked={member.loanEligible}
                            onCheckedChange={() => toggleLoanEligibility(member.id)}
                          />
                        </td>
                        <td className="p-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
