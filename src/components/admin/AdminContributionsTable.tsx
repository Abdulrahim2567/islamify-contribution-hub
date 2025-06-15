
import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Contribution record type from islamify_recent_activities
interface ContributionRecord {
  type: "contribution";
  amount: number;
  memberId: number;
  memberName: string;
  date: string;
  performedBy: string;
  description?: string;
}

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

// Edit form for a contribution
function EditContributionDialog({ open, onOpenChange, record, onSave }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  record: ContributionRecord | null,
  onSave: (updated: ContributionRecord) => void,
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    if (record) {
      setAmount(record.amount.toString());
      setDescription(record.description || "");
    }
  }, [record]);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Contribution</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (XAF)</label>
            <Input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={0}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <Input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save changes
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

  // Update local storage (and state) after edit/delete
  const saveContributions = (updatedList: ContributionRecord[]) => {
    setContributions(updatedList);
    localStorage.setItem(ACTIVITY_LOCALSTORAGE_KEY, JSON.stringify(updatedList));
  };

  // Edit handler
  const handleSaveEdit = (updated: ContributionRecord) => {
    const idx = contributions.findIndex(x =>
      x.date === editing?.date &&
      x.memberId === editing?.memberId
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

  // Delete handler
  const handleDelete = (record: ContributionRecord) => {
    if (!window.confirm(`Delete ${record.amount} XAF from ${record.memberName}?`)) return;
    const filtered = contributions.filter(
      a =>
        !(
          a.date === record.date &&
          a.memberId === record.memberId &&
          a.amount === record.amount
        )
    );
    saveContributions(filtered);
    toast({
      title: "Contribution Deleted",
      description: `Deleted ${record.amount.toLocaleString()} XAF contribution for ${record.memberName}.`,
      variant: "destructive",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden my-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Manage Contributions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
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
                  <td colSpan={6} className="py-6 text-center text-gray-400">No contributions yet.</td>
                </tr>
              )}
              {contributions.map((rec, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-4 font-medium">{rec.memberName}</td>
                  <td className="py-2 px-4">{rec.amount.toLocaleString()}</td>
                  <td className="py-2 px-4">{new Date(rec.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{rec.description || "-"}</td>
                  <td className="py-2 px-4">{rec.performedBy}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
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
                      onClick={() => handleDelete(rec)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
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
    </div>
  );
};

export default AdminContributionsTable;
