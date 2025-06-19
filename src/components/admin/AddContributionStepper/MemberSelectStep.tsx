
import React, { useEffect, useState } from "react";
import { User, ArrowLeft, ArrowRight, Users } from "lucide-react";
import type { Member } from "../types";

const DEMO_ADMIN_EMAIL = "admin@islamify.org";
const MEMBERS_KEY = "islamify_members";

interface MemberSelectStepProps {
  members: Member[];
  selectedMember: Member | null;
  onSelect: (member: Member) => void;
  onNext: () => void;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const PAGE_SIZE = 6;

function getLocalMembers() {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    const members: Member[] = data ? JSON.parse(data) : [];
    return members.filter(m => m.email !== DEMO_ADMIN_EMAIL);
  } catch {
    return [];
  }
}

const MemberSelectStep: React.FC<MemberSelectStepProps> = ({
  selectedMember,
  onSelect,
  onNext,
  page,
  setPage,
}) => {
  const [localMembers, setLocalMembers] = useState<Member[]>([]);

  useEffect(() => {
    setLocalMembers(getLocalMembers());
  }, [page]);

  const totalPages = Math.ceil(localMembers.length / PAGE_SIZE) || 1;
  const pageMembers = localMembers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasNoMembers = localMembers.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 text-center">Select Member</h2>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 px-6 overflow-y-auto" style={{ minHeight: 300, maxHeight: 400 }}>
        {hasNoMembers ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Users className="mx-auto mb-2" size={36} />
            <p className="mb-2">No members are available to select.<br />Please register members to add contributions.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        )}
      </div>

      {/* Fixed Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 mt-auto">
        {/* Pagination Controls */}
        {!hasNoMembers && totalPages > 1 && (
          <div className="flex justify-center gap-1 mb-4">
            <button
              className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 py-1 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              type="button"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="px-3 py-1 text-gray-500 text-sm select-none">{`Page ${page + 1} of ${totalPages}`}</span>
            <button
              className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 py-1 disabled:opacity-40"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              type="button"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow hover:from-emerald-600 hover:to-blue-600 transition-all disabled:opacity-60"
            disabled={hasNoMembers || !selectedMember}
            onClick={onNext}
            type="button"
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSelectStep;
