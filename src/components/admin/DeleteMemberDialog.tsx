
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

interface DeleteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberName: string;
  onConfirm: () => void;
}

const DeleteMemberDialog: React.FC<DeleteMemberDialogProps> = ({
  open,
  onOpenChange,
  memberName,
  onConfirm,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogPortal>
      <AlertDialogOverlay />
      {/* Modal width reduced from max-w-lg (32rem) to max-w-md (28rem), padding decreased */}
      <AlertDialogContent className="animate-fade-in max-w-md p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete member
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="mb-4">
          Are you sure you want to delete <span className="font-semibold text-red-600">{memberName}</span>? This action cannot be undone.
        </AlertDialogDescription>
        {/* Modal footer: always stacks vertically, gap for spacing, and removes top margin on first, bottom on last */}
        <AlertDialogFooter className="flex flex-col gap-3 !flex-col !sm:flex-col">
          <AlertDialogCancel className="w-full py-3 text-base rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-none border-none hover:bg-gray-200 dark:hover:bg-gray-700 mb-0">
            No, don&apos;t delete
          </AlertDialogCancel>
          <AlertDialogAction
            className="w-full py-3 text-base rounded-lg bg-red-600 text-white hover:bg-red-700 mt-0"
            onClick={onConfirm}
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialog>
);

export default DeleteMemberDialog;

