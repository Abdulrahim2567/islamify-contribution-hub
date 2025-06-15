
import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteContributionDialog from "./DeleteContributionDialog";
import EditContributionDialog from "./EditContributionDialog";
import ContributionsTable from "./ContributionsTable";

// Type for islamify_recent_activities
interface ContributionRecord {
  type: "contribution";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  performedBy: string;
  description?: string;
}

// Local storage key
const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

const AdminContributionsTable: React.FC = () => {
  const { toast } = useToast();
  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [editing, setEditing] = useState<ContributionRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ContributionRecord | null>(null);

  // Pagination state
  const PER_PAGE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
    if (stored) {
      try {
        const parsed: ContributionRecord[] = JSON.parse(stored).filter(
          (a: any) => a.type === "contribution"
        );
        setContributions(parsed);
      } catch (err) {
        setContributions([]);
      }
    }
  }, []);

  // Pagination derived values
  const totalPages = Math.ceil(contributions.length / PER_PAGE);
  const paginatedContributions = contributions.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages);
    if (totalPages === 0 && page !== 1) setPage(1);
  }, [contributions, page, totalPages]);

  const saveContributions = (updatedList: ContributionRecord[]) => {
    setContributions(updatedList);
    localStorage.setItem(ACTIVITY_LOCALSTORAGE_KEY, JSON.stringify(updatedList));
  };

  // -----> FIX: On edit, update recent_activities, members, and admin activities
  const handleSaveEdit = (updated: ContributionRecord) => {
    const idx = contributions.findIndex(
      x => x.date === editing?.date && x.memberId === editing?.memberId
    );
    if (idx !== -1 && editing) {
      const list = [...contributions];
      const oldRecord = list[idx];

      // Update contribution list (member activities)
      list[idx] = updated;
      saveContributions(list);

      // --- Update the member's totalContributions in islamify_members ---
      try {
        const MEMBERS_KEY = "islamify_members";
        const membersRaw = localStorage.getItem(MEMBERS_KEY);
        let members = membersRaw ? JSON.parse(membersRaw) : [];
        // Only update the matching member
        const mIdx = members.findIndex((m: any) => m.id === editing.memberId);
        if (mIdx !== -1) {
          // Reduce old amount, add new amount for this specific record edit
          members[mIdx].totalContributions =
            (members[mIdx].totalContributions || 0)
            - (oldRecord.amount || 0)
            + (updated.amount || 0);
          localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
        }
      } catch (err) {
        // Ignore member update errors
        console.log("Failed to update member totalContributions on edit", err);
      }

      // --- Add an admin activity for this edit ---
      try {
        const ADMIN_ACTIVITY_KEY = "islamify_admin_activities";
        const adminActivitiesRaw = localStorage.getItem(ADMIN_ACTIVITY_KEY);
        const adminActivities = adminActivitiesRaw ? JSON.parse(adminActivitiesRaw) : [];
        // Example admin info (if you want to add more info, adjust as needed)
        const adminInfo = {
          adminName: updated.performedBy || "Admin",
          adminEmail: undefined,
          adminRole: "admin",
        };
        const nowTime = new Date().toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
        adminActivities.unshift({
          id: Date.now() + Math.random(),
          timestamp: nowTime,
          type: "edit_contribution",
          text: `Edited contribution for "${updated.memberName}", new amount: ${updated.amount.toLocaleString()} XAF.`,
          color: "blue",
          ...adminInfo,
        });
        localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(adminActivities));
      } catch (err) {
        // Ignore logging errors
        console.log("Failed to log admin edit_contribution activity", err);
      }

      toast({
        title: "Contribution Updated",
        description: `Contribution for ${updated.memberName} updated.`,
      });
    }
    setEditOpen(false);
    setEditing(null);
  };

  const handleDelete = (record: ContributionRecord) => {
    setToDelete(record);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    const filtered = contributions.filter(
      a =>
        !(
          a.date === toDelete.date &&
          a.memberId === toDelete.memberId &&
          a.amount === toDelete.amount
        )
    );
    saveContributions(filtered);
    toast({
      title: "Contribution Deleted",
      description: `Deleted ${toDelete.amount.toLocaleString()} XAF contribution for ${toDelete.memberName}.`,
      variant: "destructive",
    });
    setDeleteOpen(false);
    setToDelete(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden my-10 max-w-4xl mx-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-4 mb-7">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow">
            <Coins className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Manage Contributions</h2>
            <span className="text-sm text-gray-500">Edit or delete individual member contributions below.</span>
          </div>
        </div>

        <ContributionsTable
          data={paginatedContributions}
          page={page}
          totalPages={totalPages}
          onEdit={(rec) => {
            setEditing(rec);
            setEditOpen(true);
          }}
          onDelete={handleDelete}
          onPageChange={setPage}
        />
      </div>

      <EditContributionDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditing(null);
        }}
        record={editing}
        onSave={handleSaveEdit}
      />
      <DeleteContributionDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setToDelete(null);
        }}
        memberName={toDelete?.memberName || ""}
        amount={toDelete?.amount || 0}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminContributionsTable;
