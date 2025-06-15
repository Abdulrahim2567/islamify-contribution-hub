import React, { useState } from "react";
import { ToggleLeft, ToggleRight, Eye, UserX, Trash2 } from "lucide-react";
import { Member } from "./types";
import DeleteMemberDialog from "./DeleteMemberDialog";

interface MemberCardProps {
  member: Member;
  onView: (member: Member) => void;
  onStatusToggle: (id: number) => void;
  onLoanToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onView,
  onStatusToggle,
  onLoanToggle,
  onDelete,
}) => {
  const maxLoanAmount = member.totalContributions * 3;
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
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
        {/* Status toggle styled like Loan Eligible, text: Active/Inactive, green/red */}
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
        
        <button
          onClick={() => onLoanToggle(member.id)}
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
          onClick={() => onView(member)}
          className="text-emerald-600 hover:text-emerald-900 p-1"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => onStatusToggle(member.id)}
          className={`${member.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'} p-1`}
        >
          <UserX size={16} />
        </button>
        {member.role !== 'admin' && (
          <>
            <button
              onClick={() => setShowDelete(true)}
              className="text-red-600 hover:text-red-900 p-1"
            >
              <Trash2 size={16} />
            </button>
            <DeleteMemberDialog
              open={showDelete}
              onOpenChange={setShowDelete}
              memberName={member.name}
              onConfirm={() => {
                setShowDelete(false);
                onDelete(member.id);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MemberCard;
