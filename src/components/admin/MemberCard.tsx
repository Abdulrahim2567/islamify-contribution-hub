
import React, { useState } from "react";
import { Eye, ToggleRight, ToggleLeft, UserX, Trash2, Mail, Phone, User, CreditCard } from "lucide-react";
import { Member } from "./types";
import DeleteMemberDialog from "./DeleteMemberDialog";

// Minimal avatar generator based on initials
const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(" ").map(s => s[0]).join("").slice(0,2).toUpperCase();
  return (
    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-lg font-semibold text-emerald-700 border-2 border-white shadow-md">
      {initials}
    </div>
  );
};

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

  // Handler to prevent footer buttons from bubbling to card click
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-xl transition-shadow min-h-[300px] relative cursor-pointer"
      onClick={() => onView(member)}
      tabIndex={0}
      role="button"
      aria-label={`View details of ${member.name}`}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          onView(member);
        }
      }}
    >
      {/* Card content */}
      <div className="flex flex-col items-center px-6 py-8 flex-1">
        {/* Avatar */}
        <Avatar name={member.name} />
        {/* Name and status */}
        <div className="mt-3 flex flex-col items-center">
          <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <User size={18} className="text-emerald-600" />
            {member.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold mt-1 tracking-widest ${
            member.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}>
            {member.role}
          </span>
          <span className={
            "flex items-center gap-1 mt-2 text-xs font-medium " +
            (member.isActive ? "text-green-600" : "text-red-500")
          }>
            {member.isActive ? (
              <>
                <ToggleRight size={16} className="text-green-600" />
                Active
              </>
            ) : (
              <>
                <ToggleLeft size={16} className="text-red-500" />
                Inactive
              </>
            )}
          </span>
        </div>
        {/* Minimal info */}
        <div className="mt-4 w-full flex flex-col gap-1 text-gray-700 dark:text-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-emerald-400" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-blue-400" />
            <span>{member.phone}</span>
          </div>
        </div>
        {/* Financial highlight row */}
        <div className="flex items-center gap-4 w-full justify-between mt-5 px-2">
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard size={13} className="text-indigo-400" />
              Contribution
            </span>
            <span className="font-semibold text-gray-800">{member.totalContributions.toLocaleString()} XAF</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard size={13} className="text-purple-400" />
              Max Loan
            </span>
            <span className="font-semibold text-gray-800">{maxLoanAmount.toLocaleString()} XAF</span>
          </div>
        </div>
      </div>
      {/* Action Footer */}
      <div
        className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-2 py-1.5"
        onClick={stopPropagation}
      >
        {/* View */}
        <button
          onClick={() => onView(member)}
          className="flex items-center gap-1 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-900 rounded-lg py-1.5 px-3 text-sm font-medium transition"
          title="View details"
          tabIndex={0}
          type="button"
        >
          <Eye size={18} />
          <span>View</span>
        </button>
        {/* Toggle Loan */}
        <button
          onClick={() => onLoanToggle(member.id)}
          className={`flex items-center gap-1 hover:bg-indigo-100 rounded-lg py-1.5 px-3 text-sm font-medium transition ${member.loanEligible ? "text-indigo-600" : "text-gray-400"}`}
          title={member.loanEligible ? "Disable Loan" : "Enable Loan"}
          tabIndex={0}
          type="button"
        >
          {member.loanEligible ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          <span>{member.loanEligible ? "Loan Enabled" : "Loan Disabled"}</span>
        </button>
        {/* Toggle status */}
        <button
          onClick={() => onStatusToggle(member.id)}
          className={`flex items-center gap-1 rounded-lg hover:bg-orange-100 py-1.5 px-3 text-sm font-medium transition ${member.isActive ? "text-orange-600" : "text-green-600"}`}
          title={member.isActive ? "Deactivate" : "Reactivate"}
          tabIndex={0}
          type="button"
        >
          <UserX size={18} />
          <span>{member.isActive ? "Deactivate" : "Reactivate"}</span>
        </button>
        {/* Delete (only for non-admins) */}
        {member.role !== "admin" && (
          <>
            <button
              onClick={() => setShowDelete(true)}
              className="flex items-center gap-1 rounded-lg hover:bg-red-100 text-red-600 py-1.5 px-3 text-sm font-medium transition"
              title="Delete member"
              tabIndex={0}
              type="button"
            >
              <Trash2 size={18} />
              <span>Delete</span>
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
