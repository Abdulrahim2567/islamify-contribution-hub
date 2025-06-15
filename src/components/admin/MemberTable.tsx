
import React, { useState } from "react";
import { ToggleLeft, ToggleRight, Eye, UserX, Trash2 } from "lucide-react";
import { Member } from "./types";
import DeleteMemberDialog from "./DeleteMemberDialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface MemberTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onStatusToggle: (id: number) => void;
  onLoanToggle: (id: number) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  onRoleChange: (id: number, newRole: "member" | "admin") => void;
}

const MemberTable: React.FC<MemberTableProps> = ({
  members,
  onView,
  onStatusToggle,
  onLoanToggle,
  onDelete,
  searchTerm,
  onRoleChange,
}) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                    <Select
                      value={member.role}
                      onValueChange={(newRole) => onRoleChange(member.id, newRole as "member" | "admin")}
                    >
                      <SelectTrigger className={`px-2 py-1 w-[110px] bg-blue-50 text-blue-800 rounded-full font-semibold text-xs hover:bg-blue-100`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {member.totalContributions.toLocaleString()} XAF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {maxLoanAmount.toLocaleString()} XAF
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Status toggle: text Active/Inactive, green/red */}
                    <button
                      onClick={() => onStatusToggle(member.id)}
                      className="flex items-center space-x-1"
                    >
                      {member.isActive ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`text-xs ${member.isActive ? "text-green-600" : "text-red-600"}`}>
                        {member.isActive ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onLoanToggle(member.id)}
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
                      onClick={() => onView(member)}
                      className="text-emerald-600 hover:text-emerald-900"
                    >
                      <Eye size={16} />
                    </button>
                    {/* Restore delete button for non-admins only */}
                    {member.role !== 'admin' && (
                      <>
                        <button
                          onClick={() => setDeleteId(member.id)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete member"
                        >
                          <Trash2 size={16} />
                        </button>
                        <DeleteMemberDialog
                          open={deleteId === member.id}
                          onOpenChange={(open: boolean) => setDeleteId(open ? member.id : null)}
                          memberName={member.name}
                          onConfirm={() => {
                            setDeleteId(null);
                            onDelete(member.id);
                          }}
                        />
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTable;
