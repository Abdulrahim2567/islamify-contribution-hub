
import React from "react";
import { Edit, User } from "lucide-react";
import { Member } from "./types";
import EditMemberDialog from "./EditMemberDialog";
import MemberAvatar from "./MemberAvatar";
import RoleSelect from "./RoleSelect";
import StatusBadge from "./StatusBadge";
import MemberInfoSection from "./MemberInfoSection";
import MemberActionFooter from "./MemberActionFooter";

// ADDED: Accept currentUser as a prop
interface MemberCardProps {
  member: Member;
  currentUser: Member;
  onView: (member: Member) => void;
  onStatusToggle: (id: number) => void;
  onLoanToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onRoleChange: (id: number, newRole: "member" | "admin") => void;
  onEdit?: (id: number, data: { name: string; email: string; phone: string }) => void;
  readOnly?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currentUser,
  onView,
  onStatusToggle,
  onLoanToggle,
  onDelete,
  onRoleChange,
  onEdit,
  readOnly = false
}) => {
  const [showEdit, setShowEdit] = React.useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onView(member);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      onView(member);
    }
  };

  return (
    <div
      className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-xl transition-shadow min-h-[320px] relative cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View details of ${member.name}`}
      onKeyDown={handleKeyDown}
    >
      {/* Top section: Avatar, name, role (as SELECT or text), status */}
      <div className="relative pt-6 pb-4 px-4 flex flex-col items-center bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 dark:from-emerald-900 dark:to-emerald-700">
        {/* Edit Button in top left */}
        {onEdit && !readOnly && (
          <>
            <button
              onClick={e => {
                e.stopPropagation();
                setShowEdit(true);
              }}
              className="absolute left-3 top-3 z-20 bg-white/90 rounded-full p-1.5 hover:bg-blue-100 hover:text-blue-700 text-blue-600 shadow transition"
              type="button"
              title="Edit member"
              tabIndex={0}
            >
              <Edit size={16} />
              <span className="sr-only">Edit</span>
            </button>
            <EditMemberDialog
              open={showEdit}
              onOpenChange={setShowEdit}
              member={member}
              onSave={(id, data) => {
                setShowEdit(false);
                if (onEdit) onEdit(id, data);
              }}
            />
          </>
        )}
        {/* Avatar */}
        <div className="z-10">
          <MemberAvatar name={member.name} />
        </div>
        {/* Name and (role as select or text) */}
        <div className="mt-2 flex flex-col items-center z-10">
          <span className="flex items-center gap-2 text-lg font-bold text-white drop-shadow">
            <User size={18} className="text-white" />
            {member.name}
          </span>
          <span className="mt-1">
            {/* Conditionally show dropdown for admin, text label for others */}
            {currentUser?.role === "admin" && !readOnly ? (
              <RoleSelect
                member={member}
                onRoleChange={onRoleChange}
              />
            ) : (
              <div className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[100px] flex justify-center mx-auto">
                {member.role}
              </div>
            )}
          </span>
        </div>
        <StatusBadge isActive={member.isActive} />
      </div>
      <MemberInfoSection member={member} />
      <MemberActionFooter
        member={member}
        onView={onView}
        onStatusToggle={onStatusToggle}
        onLoanToggle={onLoanToggle}
        onDelete={onDelete}
        readOnly={readOnly}
      />
    </div>
  );
};

export default MemberCard;

