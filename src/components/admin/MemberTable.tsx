import React, { useState, useMemo } from "react";
import {
	ToggleLeft,
	ToggleRight,
	Eye,
	Trash2,
	Edit,
	User,
	Shield,
} from "lucide-react";
import { Member } from "../../types/types";
import DeleteMemberDialog from "./DeleteMemberDialog";
import EditMemberDialog from "./EditMemberDialog";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";

interface MemberTableProps {
	members: Member[];
	onView: (member: Member) => void;
	onStatusToggle: (id: number) => void;
	onLoanToggle: (id: number) => void;
	onDelete: (id: number) => void;
	searchTerm: string;
	onRoleChange: (id: number, newRole: "member" | "admin") => void;
	onEdit?: (
		id: number,
		data: { name: string; email: string; phone: string }
	) => void;
}

const MemberTable: React.FC<MemberTableProps> = ({
	members,
	onView,
	onStatusToggle,
	onLoanToggle,
	onDelete,
	searchTerm,
	onRoleChange,
	onEdit,
}) => {
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [editMember, setEditMember] = useState<Member | null>(null);
	const [editOpen, setEditOpen] = useState(false);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	// Filter members by search term if needed (optional)
	const filteredMembers = useMemo(() => {
		if (!searchTerm) return members;
		const lowerTerm = searchTerm.toLowerCase();
		return members.filter(
			(m) =>
				m.name.toLowerCase().includes(lowerTerm) ||
				m.email.toLowerCase().includes(lowerTerm) ||
				m.phone.toLowerCase().includes(lowerTerm)
		);
	}, [members, searchTerm]);

	const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

	const paginatedMembers = useMemo(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return filteredMembers.slice(startIdx, startIdx + itemsPerPage);
	}, [filteredMembers, currentPage, itemsPerPage]);

	const handleEditSave = (
		id: number,
		data: { name: string; email: string; phone: string }
	) => {
		if (onEdit) onEdit(id, data);
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Member
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Contributions
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Max Loan
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Loan Eligible
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{paginatedMembers.map((member, idx) => {
							const maxLoanAmount = member.totalContributions * 3;

							return (
								<tr
									key={member.id}
									className="hover:bg-gray-50 animate-fade-in"
									style={{
										animationDelay: `${idx * 50}ms`,
										animationFillMode: "both",
									}}
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">
												{member.name}
											</div>
											<div className="text-sm text-gray-500">
												{member.email}
											</div>
											<div className="text-sm text-gray-500">
												{member.phone}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<Select
											value={member.role}
											onValueChange={(newRole) =>
												onRoleChange(
													member.id,
													newRole as
														| "member"
														| "admin"
												)
											}
										>
											<SelectTrigger
												className={`px-2 py-1 w-[110px] bg-blue-50 text-blue-800 rounded-full font-semibold text-xs hover:bg-blue-100`}
											>
												<div className="flex items-center gap-1">
													{member.role === "admin" ? (
														<Shield size={12} />
													) : (
														<User size={12} />
													)}
													<SelectValue />
												</div>
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="member">
													<div className="flex items-center gap-2">
														<User size={14} />
														Member
													</div>
												</SelectItem>
												<SelectItem value="admin">
													<div className="flex items-center gap-2">
														<Shield size={14} />
														Admin
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{member.totalContributions.toLocaleString()}{" "}
										XAF
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{maxLoanAmount.toLocaleString()} XAF
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() =>
												onStatusToggle(member.id)
											}
											className="flex items-center space-x-1"
										>
											{member.isActive ? (
												<ToggleRight className="w-5 h-5 text-green-600" />
											) : (
												<ToggleLeft className="w-5 h-5 text-red-600" />
											)}
											<span
												className={`text-xs ${
													member.isActive
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{member.isActive
													? "Active"
													: "Inactive"}
											</span>
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() =>
												onLoanToggle(member.id)
											}
											className="flex items-center space-x-1"
										>
											{member.loanEligible ? (
												<ToggleRight className="w-5 h-5 text-green-600" />
											) : (
												<ToggleLeft className="w-5 h-5 text-gray-400" />
											)}
											<span
												className={`text-xs ${
													member.loanEligible
														? "text-green-600"
														: "text-gray-400"
												}`}
											>
												{member.loanEligible
													? "Enabled"
													: "Disabled"}
											</span>
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
										<button
											onClick={() => onView(member)}
											className="text-emerald-600 hover:text-emerald-900"
											aria-label="View member"
										>
											<Eye size={16} />
										</button>
										<button
											onClick={() => {
												setEditMember(member);
												setEditOpen(true);
											}}
											className="text-blue-600 hover:text-blue-900"
											aria-label="Edit member"
										>
											<Edit size={16} />
										</button>
										{member.role !== "admin" && (
											<>
												<button
													onClick={() =>
														setDeleteId(member.id)
													}
													className="text-red-600 hover:text-red-900"
													aria-label="Delete member"
												>
													<Trash2 size={16} />
												</button>
												<DeleteMemberDialog
													open={
														deleteId === member.id
													}
													onOpenChange={(
														open: boolean
													) =>
														setDeleteId(
															open
																? member.id
																: null
														)
													}
													memberName={member.name}
													onConfirm={() => {
														setDeleteId(null);
														onDelete(member.id);
													}}
												/>
											</>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Pagination + Items per page */}
			{totalPages > 1 && (
				<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 bg-white/90 flex-shrink-0">
					<div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500">Items per page:</span>
						<Select
							value={String(itemsPerPage)}
							onValueChange={(value) => {
								setItemsPerPage(Number(value));
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[110px] hover:bg-blue-100 flex justify-center mx-auto">
								<SelectValue />
							</SelectTrigger>

							<SelectContent side="top">
								{[5, 10, 20, 50].map((value) => (
									<SelectItem
										key={value}
										value={String(value)}
									>
										{value} / page
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									aria-disabled={currentPage === 1}
									tabIndex={currentPage === 1 ? -1 : 0}
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage((prev) =>
											Math.max(1, prev - 1)
										);
									}}
								/>
							</PaginationItem>
							{Array.from({ length: totalPages }).map((_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										href="#"
										isActive={currentPage === i + 1}
										onClick={(e) => {
											e.preventDefault();
											setCurrentPage(i + 1);
										}}
									>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationItem>
								<PaginationNext
									href="#"
									aria-disabled={currentPage === totalPages}
									tabIndex={
										currentPage === totalPages ? -1 : 0
									}
									onClick={(e) => {
										e.preventDefault();
										setCurrentPage((prev) =>
											Math.min(totalPages, prev + 1)
										);
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			<EditMemberDialog
				open={editOpen}
				onOpenChange={(open) => {
					setEditOpen(open);
					if (!open) setEditMember(null);
				}}
				member={editMember}
				onSave={handleEditSave}
			/>
		</div>
	);
};

export default MemberTable;
