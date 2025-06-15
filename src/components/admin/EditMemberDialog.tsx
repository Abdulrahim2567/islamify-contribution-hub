
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Pencil, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { Member } from "./types";

interface EditMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onSave: (id: number, data: { name: string; email: string; phone: string }) => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  open,
  onOpenChange,
  member,
  onSave,
}) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (member) {
      setForm({ name: member.name, email: member.email, phone: member.phone });
    }
  }, [member]);

  if (!member) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(member.id, form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pencil className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Member</h1>
          <p className="text-sm text-muted-foreground">
            Update this member's account information.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            <strong>Email and phone should be unique.</strong>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Information will take effect immediately.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
              <Input
                className="pl-10"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                maxLength={100}
              />
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
              <Input
                name="email"
                type="email"
                className="pl-10"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                maxLength={100}
              />
            </div>
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 input-icon" size={20} />
              <Input
                name="phone"
                className="pl-10"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                maxLength={20}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 flex items-center justify-center gap-2"
            >
              <Check size={18} className="mr-1" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
