import { useState, useEffect } from "react";
import { Search, Grid, List, Users, User, Shield, Check } from "lucide-react";
import MemberCard from "../admin/member/MemberCard";
import { Member } from "../../types/types";
import MemberDetailModal from "../admin/member/MemberDetailModal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "../ui/input";
import MemberTable from "../admin/member/MemberTable";
import { useMembers } from "@/hooks/useMembers";

interface MembersPageProps {
	currentUser: Member;
}

const MembersPage = ({ currentUser }: MembersPageProps) => {
	const { members } = useMembers();

	const [viewMode, setViewMode] = useState<"card" | "table">("table");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [cardsShouldAnimate, setCardsShouldAnimate] = useState(false);
	const [membersPage, setMembersPage] = useState(1);
	const [membersPerPage, setMembersPerPage] = useState(12);
	const [searchStatus, setSearchStatus] = useState<
		"idle" | "typing" | "done"
	>("idle");

	// Filter out demo admin
	const filtered = members.filter(
		(m) =>
			m.email !== "admin@islamify.com" &&
			(m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				m.email.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	// Pagination logic
	const totalMembersPages = Math.ceil(filtered.length / membersPerPage);
	const paginatedMembers = filtered.slice(
		(membersPage - 1) * membersPerPage,
		membersPage * membersPerPage
	);

	// Handle page change
	const handleMembersPageChange = (page: number) => {
		if (page < 1 || page > totalMembersPages) return;
		setMembersPage(page);
	};

	// Reset page when search changes
	useEffect(() => {
		setMembersPage(1);
	}, [searchTerm, membersPerPage]);

	useEffect(() => {
		if (searchTerm === "") {
			setSearchStatus("idle");
			return;
		}
		setSearchStatus("typing");
		const timeout = setTimeout(() => setSearchStatus("done"), 600);
		return () => clearTimeout(timeout);
	}, [searchTerm]);

	const handleView = (member: Member) => {
		setSelectedMember(member);
	};

	const noop = () => {};

	return (
		<div className="max-w-8xl mx-auto px-4 py-7">
			<div className="mb-7 flex justify-between items-center">
				<div className="flex items-center gap-3 px-3">
					<Users className="w-8 h-8 text-emerald-600" />
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300/80">
						Members Directory
					</h1>
				</div>
				<div className="flex items-center space-x-3">
					<button
						onClick={() => {
							setViewMode("table");
							setCardsShouldAnimate(false);
						}}
						className={`p-2 rounded-lg transition-all ${
							viewMode === "table"
								? "bg-emerald-100 text-emerald-600 dark:bg-blue-400/5 dark:text-blue-300/80"
								: "text-gray-400 hover:text-gray-600"
						}`}
						aria-label="Table view"
					>
						<List size={20} />
					</button>
					<button
						onClick={() => {
							setViewMode("card");
							setCardsShouldAnimate(true);
							setTimeout(() => setCardsShouldAnimate(false), 700);
						}}
						className={`p-2 rounded-lg  transition-all ${
							viewMode === "card"
								? "bg-emerald-100 text-emerald-600 dark:bg-blue-400/5 dark:text-blue-300/80"
								: "text-gray-400 hover:text-gray-600"
						}`}
						aria-label="Card view"
					>
						<Grid size={20} />
					</button>
				</div>
			</div>

			{/* Search and Pagination Controls */}
			<div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center px-2">
				<div className="relative flex-1 max-w-md">
					<Search
						size={16}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
					/>
					<Input
						type="text"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-3 bg-background dark:border-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
						placeholder="Search members..."
					/>
					<div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 z-10">
						{searchStatus === "typing" ? (
							<svg
								className="animate-spin h-4 w-4 text-blue-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
						) : searchStatus === "done" ? (
							<Check size={16} className="text-blue-600" />
						) : null}
					</div>
				</div>
			
			</div>

			{viewMode === "card" ? (
				<>
					<div className="flex flex-row flex-grow flex-wrap lg:justify-start sm:justify-center min-h-[400px] w-full">
						{paginatedMembers.map((member, idx) => (
							<div
								key={member.id}
								className={
									cardsShouldAnimate
										? "animate-fade-in animate-scale-in"
										: ""
								}
								style={{
									animationDelay: cardsShouldAnimate
										? `${idx * 60}ms`
										: undefined,
									animationFillMode: cardsShouldAnimate
										? "both"
										: undefined,
								}}
							>
								<MemberCard
									member={member}
									currentUser={currentUser}
									onView={handleView}
									onStatusToggle={noop}
									onLoanToggle={noop}
									onDelete={noop}
									onRoleChange={noop}
									readOnly={true}
								/>
							</div>
						))}
					</div>

					{/* Pagination for Cards */}
					{totalMembersPages > 1 && (
						<div className="mt-8 flex justify-center">
							<Pagination>
								<PaginationContent>
									{membersPage > 1 && (
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage - 1
													);
													setCardsShouldAnimate(true);
													setTimeout(
														() =>
															setCardsShouldAnimate(
																false
															),
														700
													);
												}}
											/>
										</PaginationItem>
									)}

									{Array.from(
										{
											length: totalMembersPages,
										},
										(_, i) => i + 1
									).map((page) => (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														page
													);
													setCardsShouldAnimate(true);
													setTimeout(
														() =>
															setCardsShouldAnimate(
																false
															),
														700
													);
												}}
												isActive={page === membersPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									{membersPage < totalMembersPages && (
										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage + 1
													);
													setCardsShouldAnimate(true);
													setTimeout(
														() =>
															setCardsShouldAnimate(
																false
															),
														700
													);
												}}
											/>
										</PaginationItem>
									)}
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			) : (
				<>
					<div className="min-h-[400px]">
						<MemberTable
							members={members}
							currentUser={currentUser}
							onView={handleView}
							onStatusToggle={noop}
							onLoanToggle={noop}
							onDelete={noop}
							searchTerm={""}
							onRoleChange={noop}
						/>
					</div>

					{/* Pagination for Table */}
					{totalMembersPages > 1 && (
						<div className="mt-6 flex justify-center">
							<Pagination>
								<PaginationContent>
									{membersPage > 1 && (
										<PaginationItem>
											<PaginationPrevious
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage - 1
													);
												}}
											/>
										</PaginationItem>
									)}

									{Array.from(
										{ length: totalMembersPages },
										(_, i) => i + 1
									).map((page) => (
										<PaginationItem key={page}>
											<PaginationLink
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														page
													);
												}}
												isActive={page === membersPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									))}

									{membersPage < totalMembersPages && (
										<PaginationItem>
											<PaginationNext
												href="#"
												onClick={(e) => {
													e.preventDefault();
													handleMembersPageChange(
														membersPage + 1
													);
												}}
											/>
										</PaginationItem>
									)}
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</>
			)}

			{selectedMember && (
				<MemberDetailModal
					member={selectedMember}
					onClose={() => {
						setSelectedMember(null);
					}}
				/>
			)}
		</div>
	);
};

// Read-only table component with animations
interface MTROProps {
	members: Member[];
	onView: (member: Member) => void;
	searchTerm: string;
}

// const MembersTableReadOnly = ({ members, onView }: MTROProps) => (
// 	<div className="bg-background rounded-xl shadow-sm border border-gray-200 dark:border-gray-900 overflow-hidden">
// 		<div className="overflow-x-auto">
// 			<table className="w-full">
// 				<thead className="bg-background border-b border-gray-200 dark:border-gray-900">
// 					<tr>
// 						<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300/80 uppercase tracking-wider">
// 							Member
// 						</th>
// 						<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300/80 uppercase tracking-wider">
// 							Role
// 						</th>
// 						<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300/80 uppercase tracking-wider">
// 							Phone
// 						</th>
// 						<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300/80 uppercase tracking-wider">
// 							Joined
// 						</th>
// 					</tr>
// 				</thead>
// 				<tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-900">
// 					{members.map((member, idx) => (
// 						<tr
// 							key={member.id}
// 							className="hover:bg-background cursor-pointer animate-fade-in"
// 							onClick={() => {
// 								onView(member);
// 							}}
// 							tabIndex={0}
// 							role="button"
// 							style={{
// 								animationDelay: `${idx * 50}ms`,
// 								animationFillMode: "both",
// 							}}
// 						>
// 							<td className="px-6 py-4 whitespace-nowrap flex">
// 								<>
// 									{member.role === "admin" ? (
// 										<Shield
// 											size={25}
// 											className="my-auto mr-3 text-gray-900/60 dark:text-gray-300/70"
// 										/>
// 									) : (
// 										<User
// 											size={25}
// 											className="my-auto mr-3 text-gray-900/60 dark:text-gray-300/70"
// 										/>
// 									)}
// 									<div>
// 										<div className="text-sm font-medium text-gray-900 dark:text-gray-300/90">
// 											{member.name}
// 										</div>
// 										<div className="text-sm text-gray-500 dark:text-gray-300/50">
// 											{member.email}
// 										</div>
// 										<div className="text-sm text-gray-500 dark:text-gray-300/50">
// 											{member.phone}
// 										</div>
// 									</div>
// 								</>
// 							</td>
// 							<td className="px-6 py-4 whitespace-nowrap">
// 								<div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300/80 font-semibold">
// 									{member.role === "admin" ? (
// 										<Shield size={12} />
// 									) : (
// 										<User size={12} />
// 									)}
// 									{member.role}
// 								</div>
// 							</td>
// 							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-500/80">
// 								{member.phone}
// 							</td>
// 							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-500/80">
// 								{member.joinDate}
// 							</td>
// 						</tr>
// 					))}
// 				</tbody>
// 			</table>

// 		</div>
// 	</div>
// );

export default MembersPage;
