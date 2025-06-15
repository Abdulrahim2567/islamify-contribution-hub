
// Modern, clean manage contributions table for ADMIN

import React, { useState, useEffect } from "react";
import { Pencil, Trash2, Coins, FileText } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import DeleteContributionDialog from "./DeleteContributionDialog";

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

// Edit dialog with modern banner and design
function EditContributionDialog({
  open,
  onOpenChange,
  record,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ContributionRecord | null;
  onSave: (updated: ContributionRecord) => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (record) {
      setAmount(record.amount.toString());
      setDescription(record.description || "");
    }
  }, [record]);
  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;
    const updated: ContributionRecord = {
      ...record,
      amount: Number(amount),
      description,
    };
    onSave(updated);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {/* Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Contribution</h1>
          <p className="text-sm text-muted-foreground">Update contribution details below.</p>
        </div>
        {/* Info Banner */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-cyan-800">
            Only the amount and description <strong>can be edited.</strong>
          </p>
          <p className="text-xs text-cyan-600 mt-1">
            All changes are saved immediately.
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (XAF)</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="number"
                className="pl-10"
                value={amount}
                min={0}
                required
                onChange={e => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                className="pl-10"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const AdminContributionsTable: React.FC = () => {
  const { toast } = useToast();
  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [editing, setEditing] = useState<ContributionRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<ContributionRecord | null>(null);

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

  const saveContributions = (updatedList: ContributionRecord[]) => {
    setContributions(updatedList);
    localStorage.setItem(ACTIVITY_LOCALSTORAGE_KEY, JSON.stringify(updatedList));
  };

  const handleSaveEdit = (updated: ContributionRecord) => {
    const idx = contributions.findIndex(
      x => x.date === editing?.date && x.memberId === editing?.memberId
    );
    if (idx !== -1) {
      const list = [...contributions];
      list[idx] = updated;
      saveContributions(list);
      toast({
        title: "Contribution Updated",
        description: `Contribution for ${updated.memberName} updated.`,
      });
    }
    setEditOpen(false);
    setEditing(null);
  };

  // Delete handler uses dialog now!
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
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-gray-50">
          <table className="min-w-full text-sm divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Member</th>
                <th className="py-3 px-4 text-left">Amount (XAF)</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">By</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contributions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No contributions yet.
                  </td>
                </tr>
              )}
              {contributions.map((rec, idx) => (
                <tr key={idx} className="border-b last:border-b-0 bg-white">
                  <td className="py-3 px-4 font-medium text-gray-900">{rec.memberName}</td>
                  <td className="py-3 px-4 text-cyan-700 font-semibold">{rec.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-700">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{rec.description || "-"}</td>
                  <td className="py-3 px-4 text-gray-600">{rec.performedBy}</td>
                  <td className="py-2 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => {
                          setEditing(rec);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-2"
                        onClick={() => handleDelete(rec)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
