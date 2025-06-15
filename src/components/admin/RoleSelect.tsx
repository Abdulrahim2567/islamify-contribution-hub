
import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { Member } from "./types";

interface RoleSelectProps {
  member: Member;
  onRoleChange: (id: number, newRole: "member" | "admin") => void;
}
const RoleSelect: React.FC<RoleSelectProps> = ({ member, onRoleChange }) => (
  <Select
    value={member.role}
    onValueChange={(newRole) => onRoleChange(member.id, newRole as "member" | "admin")}
  >
    <SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[100px] flex justify-center mx-auto hover:bg-blue-100">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="member">Member</SelectItem>
      <SelectItem value="admin">Admin</SelectItem>
    </SelectContent>
  </Select>
);

export default RoleSelect;
