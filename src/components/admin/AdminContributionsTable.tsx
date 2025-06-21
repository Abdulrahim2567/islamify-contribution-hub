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

  // Function to update all contributions for a member across the app
  const updateAllContributionsForMember = (memberId: number, updatedFields: Partial<ContributionRecord>) => {
    const RECENT_ACTIVITIES_KEY = "islamify_recent_activities";
    const stored = localStorage.getItem(RECENT_ACTIVITIES_KEY);
    let activities: ContributionRecord[] = stored ? JSON.parse(stored) : [];
    let modified = false;
    activities = activities.map((rec) => {
      if (rec.type === "contribution" && rec.memberId === memberId) {
        modified = true;
        return { ...rec, ...updatedFields };
      }
      return rec;
    });
    if (modified) {
      localStorage.setItem(RECENT_ACTIVITIES_KEY, JSON.stringify(activities));
    }
  };

  const handleSaveEdit = (updated: ContributionRecord) => {
    const idx = contributions.findIndex(
      x => x.date === editing?.date && x.memberId === editing?.memberId
    );
    if (idx !== -1 && editing) {
      const list = [...contributions];
      const oldRecord = list[idx];
      // Update the main list record
      list[idx] = updated;

      // --- Update ALL contributions amount/description for this member across the app ---
      // First, update the in-memory list too
      for (let i = 0; i < list.length; ++i) {
        if (list[i].type === "contribution" && list[i].memberId === updated.memberId) {
          list[i].amount = updated.amount;
          list[i].description = updated.description;
        }
      }
      saveContributions(list);
      console.log("[edit] All contributions for member", updated.memberName, "updated to amount:", updated.amount, "description:", updated.description);

      // --- Update the member's totalContributions in islamify_members, for consistency ---
      try {
        const MEMBERS_KEY = "islamify_members";
        const membersRaw = localStorage.getItem(MEMBERS_KEY);
        let members = membersRaw ? JSON.parse(membersRaw) : [];
        // Only update the matching member
        const mIdx = members.findIndex((m: any) => m.id === editing.memberId);
        if (mIdx !== -1) {
          // Recalculate totalContributions for all their contributions
          const RECENT_ACTIVITIES_KEY = "islamify_recent_activities";
          const recentsRaw = localStorage.getItem(RECENT_ACTIVITIES_KEY);
          let recents = recentsRaw ? JSON.parse(recentsRaw) : [];
          const memberAllContribs = recents.filter((a: any) => a.type === "contribution" && a.memberId === editing.memberId);
          // If updating ALL to new amount, recalculate as new amount * num contributions:
          const newTotal = updated.amount * memberAllContribs.length;
          members[mIdx].totalContributions = newTotal;
          localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
          console.log(
            "[edit] Updated member totalContributions (ALL contributions updated):",
            members[mIdx].name,
            "to", newTotal
          );
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
          text: `Edited ALL contributions for "${updated.memberName}", new amount: ${updated.amount.toLocaleString()} XAF.`,
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

      // --- Update ALL matching contributions in recent_activities ---
      updateAllContributionsForMember(updated.memberId, {
        amount: updated.amount,
        description: updated.description,
      });

      toast({
        title: "Contributions Updated",
        description: `All contributions for ${updated.memberName} updated.`,
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Contributions</h1>
            <p className="text-gray-600">Edit or delete individual member contributions</p>
          </div>
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
