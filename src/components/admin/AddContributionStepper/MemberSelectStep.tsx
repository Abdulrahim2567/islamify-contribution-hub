
import React from "react";
import { User, ArrowLeft, ArrowRight, Users } from "lucide-react";
import type { Member } from "../types";

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

const MemberSelectStep: React.FC<MemberSelectStepProps> = ({
  members,
  selectedMember,
  onSelect,
  onNext,
  page,
  setPage,
  totalPages,
}) => {
  // Exclude "admin" users from selectable members
  const selectableMembers = members.filter(m => m.role !== "admin");
  const pageMembers = selectableMembers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const hasNoMembers = selectableMembers.length === 0;

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
          <div className="flex justify-center gap-1 mb-3">
            <button
              className="rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 px-2 py-1 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              type="button"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="px-3 py-1 text-gray-500 text-sm select-none">{`Page ${page + 1} of ${totalPages === 0 ? 1 : totalPages}`}</span>
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
        </>
      )}
      <div className="flex justify-end mt-4">
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
  );
};

export default MemberSelectStep;
