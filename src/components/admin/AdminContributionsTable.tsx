import React, { useState, useEffect } from "react";
import { Coins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DeleteContributionDialog from "./DeleteContributionDialog";
import EditContributionDialog from "./EditContributionDialog";
import ContributionsTable from "./ContributionsTable";
import { AdminActivityLog, Contribution, Member } from "@/types/types";

import {
	saveAdminRecentActivity,
	saveMemberEditContributionActivity,
} from "@/utils/recentActivities";
import { formatCurrency, getNowString } from "@/utils/calculations";
import { AppSettings, getSettings } from "@/utils/settingsStorage";
import { useMembers } from "@/hooks/useMembers";
import { useContributions } from "@/hooks/useContributions";

// Type for islamify_recent_activities
interface ContributionRecord extends Contribution {
	memberName: string; // Name of the member for display
}


const AdminContributionsTable: React.FC = () => {
	const {members, updateMember} = useMembers()
	const {contributions, getTotalContributionsByMember,updateMemberContribution, deleteMemberContribution} = useContributions()
	const { toast } = useToast();

	const [editing, setEditing] = useState<ContributionRecord | null>(null);
	const [editOpen, setEditOpen] = useState(false);

	// Delete dialog
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [toDelete, setToDelete] = useState<ContributionRecord | null>(null);

	// Pagination state
	const PER_PAGE = 10;
	const [page, setPage] = useState(1);

	//load app settings from localStorage
	const [appSettings, setAppSettings] = useState<AppSettings>();
	useEffect(() => {
		const storedSettings = getSettings();
		setAppSettings(storedSettings);
	}, []);


	// Pagination derived values
	const totalPages = Math.ceil(contributions.length / PER_PAGE);
	const paginatedContributions: ContributionRecord[] = contributions
		.slice((page - 1) * PER_PAGE, page * PER_PAGE)
		.map((contribution) => {
			const member = members.find((m) => m.id === contribution.memberId);
			return {
				...contribution,
				memberName: member ? member.name : "Unknown Member",
			};
		});

	useEffect(() => {
		if (page > totalPages && totalPages > 0) setPage(totalPages);
		if (totalPages === 0 && page !== 1) setPage(1);
	}, [contributions, page, totalPages]);


	// Function to update all contributions for a member across the app

	const handleSaveEdit = (
		updatedContribution: ContributionRecord,
		oldRecord: ContributionRecord
	) => {
		const idx = contributions.findIndex(
			(x) => x.date === editing?.date && x.memberId === editing?.memberId
		);
		if (idx !== -1 && editing) {

			// --- Update the member's totalContributions in islamify_members, for consistency ---
			updateMemberContribution(
				updatedContribution.id,
				updatedContribution
			);

			const member: Member = members.find(
				(m) =>  m.id === updatedContribution.memberId
			);
			const totalMemberContributions: number =
				getTotalContributionsByMember(member.id);
			member.totalContributions = totalMemberContributions;

			if (
				member.totalContributions >=
				appSettings.loanEligibilityThreshold
			)
				member.canApplyForLoan = true;
			else member.canApplyForLoan = false;

			updateMember(member.id, member);

			// --- Add an admin activity for this edit ---
			const adminActivity: AdminActivityLog = {
				id: Date.now() + Math.random(),
				timestamp: getNowString(),
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
				}", new amount: ${formatCurrency(updatedContribution.amount)}. Description: ${
					updatedContribution.description || "No description provided"
				}.`;
			} else if (amountChanged) {
				editContributionText = `Edited contribution amount for "${
					updatedContribution.memberName
				}", new amount: ${formatCurrency(updatedContribution.amount)}`
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
				timestamp: getNowString(),
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
	//when you delete contribution
	const confirmDelete = () => {
		if (!toDelete) return;
		const filtered = contributions.filter(
			(x) => !(x.id === toDelete.id && x.memberId === toDelete.memberId)
		);
		//remove from local storage
		deleteMemberContribution(toDelete.id);

		//update member canApplyForLoan status
		const memberFound = members.find(
			(m) => m.id === toDelete.memberId
		);
		if (memberFound) {
			const updatedMember:Member = {
				...memberFound,
				totalContributions:
					memberFound.totalContributions - toDelete.amount, //if totolContributions < 0  set memberTotalContribution to 0
				canApplyForLoan:
					memberFound.totalContributions - toDelete.amount >=
					appSettings.loanEligibilityThreshold, // Assuming 1,000,000 XAF is the threshold
			};
			if (updatedMember.totalContributions < 0) {
				updatedMember.totalContributions = 0;
			}
			
			updateMember(updatedMember.id, updatedMember)
		}
		// --- Add an admin activity for this delete ---
		const adminActivity: AdminActivityLog = {
			id: Date.now() + Math.random(),
			timestamp: getNowString(),
			type: "delete_contribution",
			text: `Deleted contribution for "${
				toDelete.memberName
			}", amount: ${formatCurrency(toDelete.amount)}.`,
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
			timestamp: getNowString(),
			type: "delete_contribution",
			text: `Deleted contribution of${formatCurrency(toDelete.amount)}.`,
			color: "red",
			adminName: "Admin",
			adminEmail: undefined,
			adminRole: "admin",
			memberId: toDelete.memberId,
		};
		saveMemberEditContributionActivity(memberActivity);	
		// Show success toast
		toast({
			title: "Contribution Deleted",
			description: `Deleted ${formatCurrency(
				toDelete.amount
			)} contribution for ${toDelete.memberName}.`,
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
