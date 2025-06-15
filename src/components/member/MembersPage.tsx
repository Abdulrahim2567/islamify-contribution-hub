import { useState, useEffect } from "react";
import { Search, Grid, List, Users } from "lucide-react";
import MemberCard from "../admin/MemberCard";
import { Member } from "../admin/types";
import MemberDetailModal from "../admin/MemberDetailModal";
import { readMembers } from "../../utils/membersStorage";

interface MembersPageProps {
  currentUser: Member;
}

const MembersPage = ({ currentUser }: MembersPageProps) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    setMembers(readMembers());
  }, []);

  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Filter out yourself
  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // All action handlers (noops for read-only directory, except onView)
  const noop = () => {};

  // View handler for card and table views, sets the currently selected member
  const handleView = (member: Member) => setSelectedMember(member);

  return (
    <div className="max-w-5xl mx-auto px-2 py-7">
      <div className="mb-7 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Members Directory</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg ${viewMode === "table" ? "bg-emerald-100 text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Table view"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg ${viewMode === "card" ? "bg-emerald-100 text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Card view"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search members..."
          />
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member, idx) => (
            <div
              key={member.id}
              className="animate-fade-in"
              style={{
                animationDelay: `${idx * 60}ms`,
                animationFillMode: "both"
              }}
            >
              <MemberCard
                member={member}
                onView={handleView}
                onStatusToggle={noop}
                onLoanToggle={noop}
                onDelete={noop}
                onRoleChange={noop}
                readOnly={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <MembersTableReadOnly
            members={filtered}
            onView={handleView}
            searchTerm={searchTerm}
          />
        </div>
      )}

      {/* Show MemberDetailModal if a member is selected */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

interface MTROProps {
  members: Member[];
  onView: (member: Member) => void;
  searchTerm: string;
}

// In table mode: make each member row clickable to view details
const MembersTableReadOnly = ({ members, onView }: MTROProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr
              key={member.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onView(member)}
              tabIndex={0}
              role="button"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-700 font-semibold">{member.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.joinDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MembersPage;
