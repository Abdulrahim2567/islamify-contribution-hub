
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
      // Debug out the current and updated amounts
      console.log("[edit] Found contribution idx:", idx, "old:", oldRecord, "updated:", updated);

      // Update contribution list (member activities)
      list[idx] = updated;
      saveContributions(list);
      console.log("[edit] Contributions after update:", list);

      // --- Update the member's totalContributions in islamify_members ---
      try {
        const MEMBERS_KEY = "islamify_members";
        const membersRaw = localStorage.getItem(MEMBERS_KEY);
        let members = membersRaw ? JSON.parse(membersRaw) : [];
        // Only update the matching member
        const mIdx = members.findIndex((m: any) => m.id === editing.memberId);
        if (mIdx !== -1) {
          // Reduce old amount, add new amount for this specific record edit
          const before = members[mIdx].totalContributions || 0;
          const after = before - (oldRecord.amount || 0) + (updated.amount || 0);
          members[mIdx].totalContributions = after;
          localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
          console.log(
            "[edit] Updated member totalContributions:",
            members[mIdx].name,
            "before:", before,
            "oldDelta:", oldRecord.amount,
            "newDelta:", updated.amount,
            "after:", after
          );
        } else {
          console.log("[edit] Could not find member to update in islamify_members for id:", editing.memberId);
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
        const activityObj = {
          id: Date.now() + Math.random(),
          timestamp: nowTime,
          type: "edit_contribution",
          text: `Edited contribution for "${updated.memberName}", new amount: ${updated.amount.toLocaleString()} XAF.`,
          color: "blue",
          ...adminInfo,
        };
        adminActivities.unshift(activityObj);
        localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(adminActivities));
        console.log("[edit] Added to islamify_admin_activities:", activityObj);
      } catch (err) {
        // Ignore logging errors
        console.log("Failed to log admin edit_contribution activity", err);
      }

      // --- Optionally, ensure islamify_recent_activities is also consistent with updates ---
      try {
        const RECENT_ACTIVITIES_KEY = "islamify_recent_activities";
        const recentsRaw = localStorage.getItem(RECENT_ACTIVITIES_KEY);
        let recents = recentsRaw ? JSON.parse(recentsRaw) : [];
        // Update the matching contribution in recent activities
        // Find by date, memberId, and optionally description
        const findIdx = recents.findIndex(
          (a: any) =>
            a.type === "contribution" &&
            a.memberId === updated.memberId &&
            a.date === editing?.date
        );
        if (findIdx !== -1) {
          console.log("[edit] Updating islamify_recent_activities at", findIdx, "old:", recents[findIdx]);
          recents[findIdx] = { ...recents[findIdx], ...updated };
          localStorage.setItem(RECENT_ACTIVITIES_KEY, JSON.stringify(recents));
          console.log("[edit] islamify_recent_activities after update:", recents[findIdx]);
        } else {
          console.log("[edit] No matching activity found in islamify_recent_activities, maybe new record?");
        }
      } catch (err) {
        // Ignore logging errors
        console.log("Failed to update islamify_recent_activities on edit", err);
      }

      toast({
        title: "Contribution Updated",
        description: `Contribution for ${updated.memberName} updated.`,
      });
    } else {
      console.log("[edit] Could not find editing record when saving, idx:", idx, "editing:", editing);
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
