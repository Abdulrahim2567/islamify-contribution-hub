
import React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, UserPlus, Shield, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/calculations";

interface RegisterMemberDialogProps {
  open: boolean;
  registrationFee: number;
  onOpenChange: (open: boolean) => void;
  newMember: { name: string; email: string; phone: string; role: "member" | "admin" };
  setNewMember: (val: { name: string; email: string; phone: string; role: "member" | "admin" }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterMemberDialog: React.FC<RegisterMemberDialogProps> = ({
  open,
  registrationFee,
  onOpenChange,
  newMember,
  setNewMember,
  onSubmit,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-medium hover:from-emerald-600 hover:to-blue-600 transition-all transform hover:scale-105">
        <UserPlus size={20} />
        <span>Add Member</span>
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">Add New Member</DialogTitle>
        <DialogDescription>Register a new member to the association</DialogDescription>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-emerald-800">
          <strong>Registration Fee:</strong> {formatCurrency(registrationFee)}
        </p>
        <p className="text-xs text-emerald-600 mt-1">
          A default password will be generated and must be changed on first login.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
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
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
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
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
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
              className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border-2 transition-all ${
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
              className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border-2 transition-all ${
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
            className="flex-1 rounded-2xl"
            onClick={() => onOpenChange(false)}
          >
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-2xl"
          >
            <Plus size={16} className="mr-2" />
            Add Member
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

export default RegisterMemberDialog;
