
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, TrendingUp, Wallet, CreditCard, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock data for member contributions
const MOCK_CONTRIBUTIONS = [
  { id: 1, date: "2024-06-01", amount: 5000, type: "Monthly Contribution" },
  { id: 2, date: "2024-05-01", amount: 5000, type: "Monthly Contribution" },
  { id: 3, date: "2024-04-01", amount: 5000, type: "Monthly Contribution" },
  { id: 4, date: "2024-03-01", amount: 5000, type: "Monthly Contribution" },
  { id: 5, date: "2024-02-01", amount: 5000, type: "Monthly Contribution" },
];

const MemberDashboard = ({ user, onLogout }) => {
  const [contributions, setContributions] = useState(MOCK_CONTRIBUTIONS);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState('');
  const { toast } = useToast();

  const totalContributions = contributions.reduce((sum, c) => sum + c.amount, 0);
  const maxLoanAmount = totalContributions * 3;
  const registrationFee = 5000;

  const handleContribution = (e) => {
    e.preventDefault();
    const amount = parseInt(contributionAmount);
    if (amount < 1000) {
      toast({
        title: "Invalid Amount",
        description: "Minimum contribution is 1,000 XAF",
        variant: "destructive",
      });
      return;
    }

    const newContribution = {
      id: contributions.length + 1,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      type: "Manual Contribution"
    };

    setContributions([newContribution, ...contributions]);
    setContributionAmount('');
    setShowContributeModal(false);
    toast({
      title: "Contribution Added",
      description: `Successfully added ${amount.toLocaleString()} XAF to your contributions`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Islamify Member</h1>
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

        {/* Quick Actions */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your contributions and loans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Dialog open={showContributeModal} onOpenChange={setShowContributeModal}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Make Contribution
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Make a Contribution</DialogTitle>
                    <DialogDescription>
                      Add to your total contributions
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleContribution} className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (XAF)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={contributionAmount}
                        onChange={(e) => setContributionAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1000"
                        required
                      />
                      <p className="text-sm text-gray-600 mt-1">Minimum: 1,000 XAF</p>
                    </div>
                    <Button type="submit" className="w-full">
                      Add Contribution
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <CreditCard className="w-4 h-4 mr-2" />
                Apply for Loan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contribution History */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Contribution History</CardTitle>
            <CardDescription>Your recent contributions to the association</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{contribution.type}</p>
                        <p className="text-sm text-gray-600">{contribution.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{contribution.amount.toLocaleString()} XAF</p>
                  </div>
                </div>
              ))}
            </div>

            {contributions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No contributions yet</p>
                <p className="text-sm">Start contributing to build your savings!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDashboard;
