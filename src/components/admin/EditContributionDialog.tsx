
import React, { useState, useEffect } from "react";
import { Coins, FileText, Check, DollarSign } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contribution } from "@/types/types";

interface ContributionRecord extends Contribution {
  memberName: string;
}

interface EditContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: ContributionRecord | null;
  onSave: (updated: ContributionRecord, oldRecord: ContributionRecord) => void;
}

const EditContributionDialog: React.FC<EditContributionDialogProps> = ({
  open,
  onOpenChange,
  record,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [oldRecord, setOldRecord] = useState<ContributionRecord | null>(null);
  useEffect(() => {
    if (record) {
      setAmount(record.amount.toString());
      setDescription(record.description || "");
      setOldRecord({ ...record }); // Store a copy of the original record
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
    onSave(updated, oldRecord!);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Contribution</h1>
          <p className="text-sm text-muted-foreground">Update contribution details below.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            Only the amount and description <strong>can be edited.</strong>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            All changes are saved immediately.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (XAF)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
              <Input
                type="number"
                className="pl-10"
                style={{ position: "relative" }}
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
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
              <Input
                type="text"
                className="pl-10"
                style={{ position: "relative" }}
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
            <Button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContributionDialog;
