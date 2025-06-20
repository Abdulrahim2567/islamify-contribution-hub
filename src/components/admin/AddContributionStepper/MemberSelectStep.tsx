
import React, { useEffect, useState } from "react";
import { User, ArrowLeft, ArrowRight, Users, ChevronLeft, ChevronRight } from "lucide-react";
import type { Member } from "../types";

const DEMO_ADMIN_EMAIL = "admin@islamify.org";
const MEMBERS_KEY = "islamify_members";

interface MemberSelectStepProps {
  // We will not use the passed 'members' prop, instead always read from localStorage
  members: Member[]; // unused now
  selectedMember: Member | null;
  onSelect: (member: Member) => void;
  onNext: () => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  hideControls?: boolean;
}

const PAGE_SIZE = 6;

/**
 * Utility to always get latest members (excluding demo admin) from localStorage.
 * Do this on every render so dialog reflects the latest changes.
 */
function getLocalMembers() {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    const members: Member[] = data ? JSON.parse(data) : [];
    // Exclude only demo admin (by email), show everyone else
    return members.filter(m => m.email !== DEMO_ADMIN_EMAIL);
  } catch {
    return [];
  }
}

const MemberSelectStep: React.FC<MemberSelectStepProps> = ({
  // do not use members or totalPages prop
  selectedMember,
  onSelect,
  onNext,
  page,
  setPage,
  hideControls = false,
}) => {
  const [localMembers, setLocalMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Always get latest from localStorage on every mount or re-render
    setLocalMembers(getLocalMembers());
  }, [page]); // re-read if page changes (in case dialog stays open while members change)

  // Freshly calculate paged members and totalPages anytime localMembers/page changes
  const totalPages = Math.ceil(localMembers.length / PAGE_SIZE) || 1;
  const pageMembers = localMembers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const hasNoMembers = localMembers.length === 0;

  return (
    <div
      className={`
        transition-all duration-300 ease-in-out w-full px-6 pb-6
        opacity-100 translate-x-0 relative z-10
      `}
      style={{ minHeight: 384 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Select Member</h2>
      {hasNoMembers ? (
        <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
          <Users className="mx-auto mb-2" size={36} />
          <p className="mb-2">No members are available to select.<br />Please register members to add contributions.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {pageMembers.map((member) => (
              <button
                key={member.id}
                className={`flex flex-col items-center gap-2 border rounded-xl bg-white shadow hover:bg-emerald-50 transition-all group w-full py-3 px-2 ${
                  selectedMember?.id === member.id
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-gray-200"
                }`}
                onClick={() => onSelect(member)}
                type="button"
                tabIndex={0}
              >
                <span className="bg-emerald-100 rounded-full w-11 h-11 flex items-center justify-center transition-all">
                  <User className="text-emerald-500" size={24} />
                </span>
                <span className="font-medium text-gray-900 truncate text-base">
                  {member.name}
                </span>
              </button>
            ))}
          </div>
          
          {/* Show pagination even when hideControls is true, but not the Next button */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-600">
                {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page === totalPages - 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {!hideControls && (
            <div className="flex justify-end mt-4">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-full font-medium shadow hover:from-emerald-600 hover:to-blue-600 transition-all disabled:opacity-60"
                disabled={hasNoMembers || !selectedMember}
                onClick={onNext}
                type="button"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberSelectStep;
