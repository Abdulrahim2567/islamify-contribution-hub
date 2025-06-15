
import React, { useState } from "react";
import { Eye, ToggleRight, ToggleLeft, UserX, Trash2, Mail, Phone, User, CreditCard } from "lucide-react";
import { Member } from "./types";
import DeleteMemberDialog from "./DeleteMemberDialog";

// Minimal avatar generator based on initials
const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-semibold text-emerald-700 border-4 border-white shadow-md">
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
      className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-xl transition-shadow min-h-[320px] relative cursor-pointer"
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
      {/* Top section: Avatar, name, role, status */}
      <div className="relative pt-6 pb-4 px-4 flex flex-col items-center bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 dark:from-emerald-900 dark:to-emerald-700">
        {/* Avatar */}
        <div className="z-10">
          <Avatar name={member.name} />
        </div>
        {/* Name and role */}
        <div className="mt-2 flex flex-col items-center z-10">
          <span className="flex items-center gap-2 text-lg font-bold text-white drop-shadow">
            <User size={18} className="text-white" />
            {member.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold mt-1 tracking-widest ${
            member.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-blue-100 text-blue-700"
          }`}>
            {member.role}
          </span>
        </div>
        {/* Status badge floated to top right */}
        <span className={
          "absolute right-3 top-3 flex items-center gap-1 text-xs font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm " + 
          (member.isActive ? "text-green-600" : "text-red-500")
        }>
          {member.isActive ? (
            <>
              <ToggleRight size={14} className="text-green-600" />
              Active
            </>
          ) : (
            <>
              <ToggleLeft size={14} className="text-red-500" />
              Inactive
            </>
          )}
        </span>
      </div>

      {/* Bottom section: minimal member info */}
      <div className="flex flex-col gap-2 px-5 pt-4 pb-5 flex-1 justify-between">
        {/* Email & phone */}
        <div className="flex flex-col gap-1 text-gray-600 dark:text-gray-300 text-sm">
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-emerald-400" />
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-blue-400" />
            <span>{member.phone}</span>
          </div>
        </div>
        {/* Contribution and Max loan */}
        <div className="flex items-center gap-6 w-full justify-between mt-3">
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard size={13} className="text-indigo-400" />
              Contribution
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">{member.totalContributions.toLocaleString()} XAF</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CreditCard size={13} className="text-purple-400" />
              Max Loan
            </span>
            <span className="font-semibold text-gray-800 dark:text-white">{maxLoanAmount.toLocaleString()} XAF</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className="flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-2 py-2"
        onClick={stopPropagation}
      >
        {/* Footer Actions with icons and text stacked vertically */}
        <div className="flex flex-1 justify-evenly gap-2">
          {/* View */}
          <button
            onClick={() => onView(member)}
            className="flex flex-col items-center justify-center hover:bg-emerald-100 text-emerald-600 hover:text-emerald-900 rounded-lg py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button"
            title="View details"
            tabIndex={0}
            type="button"
          >
            <Eye size={18} />
            <span className="mt-0.5 leading-none">View</span>
          </button>
          {/* Toggle Loan */}
          <button
            onClick={() => onLoanToggle(member.id)}
            className={`flex flex-col items-center justify-center hover:bg-indigo-100 rounded-lg py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button
              ${member.loanEligible ? "text-indigo-600" : "text-gray-400"}
            `}
            title={member.loanEligible ? "Disable Loan" : "Enable Loan"}
            tabIndex={0}
            type="button"
          >
            {member.loanEligible ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
            <span className="mt-0.5 leading-none">{member.loanEligible ? "Loan Enabled" : "Loan Disabled"}</span>
          </button>
          {/* Toggle status */}
          <button
            onClick={() => onStatusToggle(member.id)}
            className={`flex flex-col items-center justify-center rounded-lg hover:bg-orange-100 py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button
              ${member.isActive ? "text-orange-600" : "text-green-600"}
            `}
            title={member.isActive ? "Deactivate" : "Reactivate"}
            tabIndex={0}
            type="button"
          >
            <UserX size={18} />
            <span className="mt-0.5 leading-none">{member.isActive ? "Deactivate" : "Reactivate"}</span>
          </button>
          {/* Delete (only for non-admins) */}
          {member.role !== "admin" && (
            <>
              <button
                onClick={() => setShowDelete(true)}
                className="flex flex-col items-center justify-center rounded-lg hover:bg-red-100 text-red-600 py-1.5 px-2 text-xs font-semibold transition focus:outline-none outline-none group/button"
                title="Delete member"
                tabIndex={0}
                type="button"
              >
                <Trash2 size={18} />
                <span className="mt-0.5 leading-none">Delete</span>
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
    </div>
  );
};

export default MemberCard;
