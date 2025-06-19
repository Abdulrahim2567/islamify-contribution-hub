

import { useState, useEffect } from "react";
import { Search, Grid, List, Users } from "lucide-react";
import MemberCard from "../admin/MemberCard";
import { Member } from "../admin/types";
import MemberDetailModal from "../admin/MemberDetailModal";
import { readMembers } from "../../utils/membersStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

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
  const [cardsShouldAnimate, setCardsShouldAnimate] = useState(false);
  const [membersPage, setMembersPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(12);

  // Filter out demo admin
  const filtered = members.filter(
    (m) =>
      m.email !== "admin@islamify.com" &&
      (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const totalMembersPages = Math.ceil(filtered.length / membersPerPage);
  const paginatedMembers = filtered.slice(
    (membersPage - 1) * membersPerPage,
    membersPage * membersPerPage
  );

  // Handle page change
  const handleMembersPageChange = (page: number) => {
    if (page < 1 || page > totalMembersPages) return;
    setMembersPage(page);
  };

  // Reset page when search changes
  useEffect(() => {
    setMembersPage(1);
  }, [searchTerm, membersPerPage]);

  const handleView = (member: Member) => {
    console.log("[MembersPage] handleView called with:", member);
    setSelectedMember(member);
  };

  const noop = () => {};

  return (
    <div className="max-w-5xl mx-auto px-2 py-7">
      <div className="mb-7 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">Members Directory</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setViewMode("table");
              setCardsShouldAnimate(false);
            }}
            className={`p-2 rounded-lg ${viewMode === "table" ? "bg-emerald-100 text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Table view"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => {
              setViewMode("card");
              setCardsShouldAnimate(true);
              setTimeout(() => setCardsShouldAnimate(false), 700);
            }}
            className={`p-2 rounded-lg ${viewMode === "card" ? "bg-emerald-100 text-emerald-600" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Card view"
          >
            <Grid size={20} />
          </button>
        </div>
      </div>

      {/* Search and Pagination Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Search members..."
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="members-per-page" className="text-sm text-gray-600">
              Per page:
            </Label>
            <Select
              value={membersPerPage.toString()}
              onValueChange={(value) => setMembersPerPage(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </Select*Trigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {Math.min((membersPage - 1) * membersPerPage + 1, filtered.length)}-{Math.min(membersPage * membersPerPage, filtered.length)} of {filtered.length} members
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
            {paginatedMembers.map((member, idx) => (
              <div
                key={member.id}
                className={
                  cardsShouldAnimate
                    ? "animate-fade-in animate-scale-in"
                    : ""
                }
                style={{
                  animationDelay: cardsShouldAnimate
                    ? `${idx * 60}ms`
                    : undefined,
                  animationFillMode: cardsShouldAnimate ? "both" : undefined
                }}
              >
                <MemberCard
                  member={member}
                  currentUser={currentUser}
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
          
          {/* Pagination for Cards */}
          {totalMembersPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {membersPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(membersPage - 1);
                          setCardsShouldAnimate(true);
                          setTimeout(() => setCardsShouldAnimate(false), 700);
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalMembersPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(page);
                          setCardsShouldAnimate(true);
                          setTimeout(() => setCardsShouldAnimate(false), 700);
                        }}
                        isActive={page === membersPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {membersPage < totalMembersPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(membersPage + 1);
                          setCardsShouldAnimate(true);
                          setTimeout(() => setCardsShouldAnimate(false), 700);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="min-h-[400px]">
            <MembersTableReadOnly
              members={paginatedMembers}
              onView={handleView}
              searchTerm={searchTerm}
            />
          </div>
          
          {/* Pagination for Table */}
          {totalMembersPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {membersPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(membersPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalMembersPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(page);
                        }}
                        isActive={page === membersPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {membersPage < totalMembersPages && (
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleMembersPageChange(membersPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          onClose={() => {
            console.log("[MembersPage] Closing modal");
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

// Read-only table component with animations
interface MTROProps {
  members: Member[];
  onView: (member: Member) => void;
  searchTerm: string;
}

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
          {members.map((member, idx) => (
            <tr
              key={member.id}
              className="hover:bg-gray-50 cursor-pointer animate-fade-in"
              onClick={() => {
                console.log("[MembersTableReadOnly] Row clicked, calling onView with:", member);
                onView(member);
              }}
              tabIndex={0}
              role="button"
              style={{
                animationDelay: `${idx * 50}ms`,
                animationFillMode: "both"
              }}
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
