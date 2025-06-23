import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteContributionDialog from "./DeleteContributionDialog";
import EditContributionDialog from "./EditContributionDialog";
import ContributionsTable from "./ContributionsTable";
import { AdminActivityLog, Contribution } from "@/types/types";
import { readMembersFromStorage } from "@/utils/membersStorage";
import { deleteContribution, getContributions, updateMemberContribution } from "@/utils/contributionStorage";
import {
	saveAdminRecentActivity,
	saveMemberEditContributionActivity,
} from "@/utils/recentActivities";

// Type for islamify_recent_activities
interface ContributionRecord extends Contribution {
	memberName: string; // Name of the member for display
}

// Local storage key
const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

const AdminContributionsTable: React.FC = () => {
	const { toast } = useToast();
	const [contributions, setContributions] = useState<ContributionRecord[]>(
		[]
	);
	const [editing, setEditing] = useState<ContributionRecord | null>(null);
	const [editOpen, setEditOpen] = useState(false);

	// Delete dialog
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [toDelete, setToDelete] = useState<ContributionRecord | null>(null);

	// Pagination state
	const PER_PAGE = 10;
	const [page, setPage] = useState(1);

	useEffect(() => {
		const stored = getContributions();
		if (stored) {
			try {
				// Add memberName to each contribution
				const members = readMembersFromStorage();
				const withNames = stored.map((c) => ({
					...c,
					memberName:
						members.find((m) => m.id === c.memberId)?.name ||
						"Unknown Member",
				}));
				setContributions(withNames);
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
	};

	// Function to update all contributions for a member across the app

	const handleSaveEdit = (
		updatedContribution: ContributionRecord,
		oldRecord: ContributionRecord
	) => {
		const idx = contributions.findIndex(
			(x) => x.date === editing?.date && x.memberId === editing?.memberId
		);
		if (idx !== -1 && editing) {
			const list = [...contributions];
			// Update the main list record
			list[idx] = updatedContribution;

			// --- Update ALL contributions amount/description for this member across the app ---
			// First, update the in-memory list too
			for (let i = 0; i < list.length; ++i) {
				if (
					list[i].type === "contribution" &&
					list[i].memberId === updatedContribution.memberId
				) {
					list[i].amount = updatedContribution.amount;
					list[i].description = updatedContribution.description;
				}
			}
			saveContributions(list);
			console.log(
				"[edit] All contributions for member",
				updatedContribution.memberName,
				"updated to amount:",
				updatedContribution.amount,
				"description:",
				updatedContribution.description
			);

			// --- Update the member's totalContributions in islamify_members, for consistency ---
			updateMemberContribution(
				updatedContribution.id,
				updatedContribution
			);

			// --- Add an admin activity for this edit ---
			const adminActivity: AdminActivityLog = {
				id: Date.now() + Math.random(),
				timestamp: new Date().toISOString(),
				type: "edit_contribution",
				text: `Edited contribution for "${
					updatedContribution.memberName
				}", new amount: ${updatedContribution.amount.toLocaleString()} XAF.`,
				color: "blue",
				adminName: updatedContribution.editedBy || "Admin",
				adminEmail: undefined,
				adminRole: "admin",
				memberId: updatedContribution.memberId,
			};

			saveAdminRecentActivity(adminActivity);

			let editContributionText = null;

			const amountChanged: boolean =
				oldRecord.amount !== updatedContribution.amount;
			const descriptionChanged: boolean =
				oldRecord.description !== updatedContribution.description;

			if (amountChanged && descriptionChanged) {
				editContributionText = `Edited contribution amount and description for "${
					updatedContribution.memberName
				}", new amount: ${updatedContribution.amount.toLocaleString()} XAF. Description: ${
					updatedContribution.description || "No description provided"
				}.`;
			} else if (amountChanged) {
				editContributionText = `Edited contribution amount for "${
					updatedContribution.memberName
				}", new amount: ${updatedContribution.amount.toLocaleString()} XAF.`;
			} else if (descriptionChanged) {
				editContributionText = `Edited contribution description for "${
					updatedContribution.memberName
				}". New description: ${
					updatedContribution.description || "No description provided"
				}.`;
			}

			// --- Update ALL matching contributions in recent_activities ---
			const editContributionActivity: AdminActivityLog = {
				id: Date.now() + Math.random(),
				timestamp: new Date().toISOString(),
				type: "edit_contribution",
				text:
					editContributionText ||
					`Edited contribution for "${updatedContribution.memberName}".`,
				color: "blue",
				adminName: updatedContribution.editedBy || "Admin",
				adminEmail: undefined,
				adminRole: "admin",
				memberId: updatedContribution.memberId,
			};

			saveMemberEditContributionActivity(editContributionActivity);

			toast({
				title: "Contribution Updated",
				description: `All contributions for ${updatedContribution.memberName} updated.`,
			});
		} else {
			console.log(
				"[edit] Could not find editing record when saving, idx:",
				idx,
				"editing:",
				editing
			);
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
			(x) =>
				!(x.id === toDelete.id && x.memberId === toDelete.memberId)
		);
		saveContributions(filtered);
    //remove from local storage
    deleteContribution(toDelete.id);
    // --- Add an admin activity for this delete ---
    const adminActivity: AdminActivityLog = {
		id: Date.now() + Math.random(),
		timestamp: new Date().toISOString(),
		type: "delete_contribution",
		text: `Deleted contribution for "${toDelete.memberName}", amount: ${toDelete.amount.toLocaleString()} XAF.`,
		color: "red",
		adminName: "Admin",
		adminEmail: undefined,
		adminRole: "admin",
		memberId: toDelete.memberId,
    };
    saveAdminRecentActivity(adminActivity);
    // --- Add a member activity for this delete ---
    const memberActivity: AdminActivityLog = {
		id: Date.now() + Math.random(),
		timestamp: new Date().toISOString(),
		type: "delete_contribution",
		text: `Deleted contribution of ${toDelete.amount.toLocaleString()} XAF.`,
		color: "red",
		adminName: "Admin",
		adminEmail: undefined,
		adminRole: "admin",
		memberId: toDelete.memberId,
    };
    saveMemberEditContributionActivity(memberActivity);
    // --- Update ALL contributions for this member across the app ---
    const members = readMembersFromStorage();
    const member = members.find((m) => m.id === toDelete.memberId);
    if (member) {
		const updatedMember = {
			...member,
			totalContributions: member.totalContributions - toDelete.amount,
		};
		const memberIndex = members.findIndex(
			(m) => m.id === updatedMember.id
		);
		if (memberIndex !== -1) {
			members[memberIndex] = updatedMember;
			localStorage.setItem("islamify_members", JSON.stringify(members));
		}
    }
    // Show success toast
		toast({
			title: "Contribution Deleted",
			description: `Deleted ${toDelete.amount.toLocaleString()} XAF contribution for ${
				toDelete.memberName
			}.`,
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
						<h1 className="text-3xl font-bold text-gray-900">
							Manage Contributions
						</h1>
						<p className="text-gray-600">
							Edit or delete individual member contributions
						</p>
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
