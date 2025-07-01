
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertDialogPortal,
} from "@/components/ui/alert-dialog";
import { X, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/calculations";

interface DeleteContributionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  amount: number;
  onConfirm: () => void;
}

const DeleteContributionDialog: React.FC<DeleteContributionDialogProps> = ({
  open,
  onOpenChange,
  memberName,
  amount,
  onConfirm,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogContent
        className={
          "max-w-sm p-4 sm:p-5 relative " +
          "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " +
          "bg-background dark:bg-background/50 backdrop-blur shadow-lg animate-fade-in"
        }
        style={{ position: "fixed" }}
      >
        {/* Close Icon */}
        <button
          type="button"
          aria-label="Close"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X size={20} />
        </button>
        <AlertDialogHeader>
          {/* Trash icon banner */}
          <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <AlertDialogTitle className="mx-auto">Delete contribution</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="mb-4 text-center">
          Are you sure you want to delete
          <span className="font-semibold text-red-600"> {formatCurrency(amount).concat(" ")}</span>
          from <span className="font-semibold">{memberName}</span>? This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter className="flex flex-col gap-2">
          <AlertDialogCancel className="w-full py-3 text-base rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-none border-none hover:bg-gray-200 dark:hover:bg-gray-700 m-0">
            No, don&apos;t delete
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-full py-3 text-base rounded-lg bg-red-600 text-white hover:bg-red-700 m-0"
            onClick={onConfirm}
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialog>
);

export default DeleteContributionDialog;
