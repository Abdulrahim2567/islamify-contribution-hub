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
import { Trash2, X } from "lucide-react";

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
			{/* Overlay: clicking this will close the modal due to Radix API */}
			<AlertDialogOverlay onClick={(e) => e.stopPropagation()} />
			{/* Modal width reduced and padding adjusted; keep it perfectly centered */}
			<AlertDialogContent
				className={
					"max-w-sm p-4 sm:p-5 relative " +
					"left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 " +
					"bg-background/60 backdrop-blur shadow-lg animate-fade-in"
				}
				onClick={(e) => e.stopPropagation()}
				style={{ position: "fixed" }} // Ensures centering works
			>
				{/* Close Icon (top-right absolute) */}
				<button
					type="button"
					aria-label="Close"
					onClick={(e) => {
						e.stopPropagation();
						onOpenChange(false);
					}}
					className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<X size={20} />
				</button>
				<AlertDialogHeader>
					{/* Trash icon banner */}
					<div className="w-14 h-14 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow">
						<Trash2 className="w-8 h-8 text-white" />
					</div>
					<AlertDialogTitle className="mx-auto">
						Delete member
					</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogDescription className="mb-4 text-center">
					Are you sure you want to delete{" "}
					<span className="font-semibold text-red-600">
						{memberName}
					</span>
					? This action cannot be undone.
				</AlertDialogDescription>
				<AlertDialogFooter className="flex flex-col gap-2">
					<AlertDialogCancel
						onClick={(e) => {
							e.stopPropagation();
						}}
						className="w-full py-3 text-base rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-none border-none hover:bg-gray-200 dark:hover:bg-gray-700 m-0"
					>
						No, don&apos;t delete
					</AlertDialogCancel>
					<AlertDialogAction
						className="w-full py-3 text-base rounded-lg bg-red-600 text-white hover:bg-red-700 m-0"
						onClick={(e) => {
							e.stopPropagation();
							onConfirm();
						}}
					>
						Yes, delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialogPortal>
	</AlertDialog>
);

export default DeleteMemberDialog;
