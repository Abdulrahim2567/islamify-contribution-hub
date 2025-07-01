import React, { useState, useEffect, useMemo } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../../ui/pagination";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Coins, Pencil, Trash2, Search, Check, List, Grid } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";
import { Contribution } from "@/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/utils/calculations";

interface ContributionRecord extends Contribution {
	memberName: string;
}

interface ContributionsTableProps {
	data: ContributionRecord[];
	page: number;
	totalPages: number;
	onEdit: (rec: ContributionRecord) => void;
	onDelete: (rec: ContributionRecord) => void;
	onPageChange: (page: number) => void;
}

const ContributionsTable: React.FC<ContributionsTableProps> = ({
	data,
	page: externalPage,
	totalPages: _externalTotalPages,
	onEdit,
	onDelete,
	onPageChange,
}) => {
	const [currentPage, setCurrentPage] = useState(externalPage || 1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchStatus, setSearchStatus] = useState<
		"idle" | "typing" | "done"
	>("idle");
	const [dateFormat, setDateFormat] = useState<"default" | "relative">(
		"relative"
	);
	const [viewMode, setViewMode] = useState<"table" | "card">("table");

	useEffect(() => {
		if (searchTerm === "") {
			setSearchStatus("idle");
			return;
		}
		setSearchStatus("typing");
		const timeout = setTimeout(() => {
			setSearchStatus("done");
		}, 600);
		return () => clearTimeout(timeout);
	}, [searchTerm]);

	useEffect(() => {
		if (externalPage && externalPage !== currentPage) {
			setCurrentPage(externalPage);
		}
	}, [externalPage]);

	const filteredData = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return data;
		return data.filter((rec) => {
			return (
				rec.memberName.toLowerCase().includes(term) ||
				rec.amount.toString().includes(term)
			);
		});
	}, [data, searchTerm]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const paginatedData = useMemo(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return filteredData.slice(startIdx, startIdx + itemsPerPage);
	}, [filteredData, currentPage, itemsPerPage]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		onPageChange(newPage);
	};

	const handleItemsPerPageChange = (value: number) => {
		setItemsPerPage(value);
		setCurrentPage(1);
		onPageChange(1);
	};

	useEffect(() => {
		setCurrentPage(1);
		onPageChange(1);
	}, [searchTerm, onPageChange]);

	return (
		<div className="space-y-4 ">
			{/* Top bar */}
			<div className="flex flex-wrap items-center gap-3 justify-between px-1">
				<div className="w-full flex-1">
					<div className="relative flex-1 max-w-[400px]">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
						/>
						<Input
							className="pl-9 pr-4 h-9 rounded-md text-sm border border-gray-300 dark:border-gray-900 focus-visible:ring-emerald-300 w-full max-w-[400px]"
							placeholder="Filter by name or amount"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<div className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 z-10">
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

				<Select
					value={dateFormat}
					onValueChange={(val) =>
						setDateFormat(val as "default" | "relative")
					}
				>
					<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-400/5 text-blue-700 dark:text-blue-300/80 rounded-full font-semibold tracking-widest w-[130px] hover:bg-blue-100 flex justify-center">
						<SelectValue />
					</SelectTrigger>
					<SelectContent side="top">
						<SelectItem value="default">Default</SelectItem>
						<SelectItem value="relative">Relative</SelectItem>
					</SelectContent>
				</Select>

				<div className="flex items-center space-x-2">
					<button
						onClick={() => setViewMode("table")}
						className={`p-2 rounded-lg ${
							viewMode === "table"
								? "bg-blue-100 text-blue-600 dark:bg-blue-400/5 dark:text-blue-300/80"
								: "text-gray-400 hover:text-gray-600 dark:text-gray-300/80 dark:hover:text-gray-500/80"
						}`}
					>
						<List size={20} />
					</button>
					<button
						onClick={() => setViewMode("card")}
						className={`p-2 rounded-lg ${
							viewMode === "card"
								? "bg-blue-100 text-blue-600 dark:bg-blue-400/5 dark:text-blue-300/80"
								: "text-gray-400 hover:text-gray-600 dark:text-gray-300/80 dark:hover:text-gray-500/80"
						}`}
					>
						<Grid size={20} />
					</button>
				</div>
			</div>

			{/* Table View */}
			{viewMode === "table" && (
				<div className="hidden md:block animate-fade-in">
					<div className="rounded-xl border border-gray-200 dark:border-gray-900 shadow-sm overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-background">
									<TableHead>Member</TableHead>
									<TableHead>Amount (XAF)</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Added By</TableHead>
									<TableHead>Edited By</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedData.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className="text-center text-gray-500 dark:text-gray-300/80 h-24"
										>
											<div className="flex flex-col items-center gap-2">
												<Coins className="w-8 h-8 text-gray-300 dark:text-gray-300/80" />
												<span>
													No contributions found.
												</span>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedData.map((rec, idx) => (
										<TableRow
											key={idx}
											className="hover:bg-gray-50 dark:hover:bg-blue-400/5 animate-fade-in"
											style={{
												animationDelay: `${idx * 50}ms`,
												animationFillMode: "both",
											}}
										>
											<TableCell>
												{rec.memberName}
											</TableCell>
											<TableCell>
												{rec.amount.toLocaleString()}
											</TableCell>
											<TableCell>
												{dateFormat === "relative"
													? formatDistanceToNow(
															new Date(rec.date),
															{
																addSuffix: true,
															}
													  ).replace(/^about\s/, "")
													: new Date(
															rec.date
													  ).toLocaleDateString()}
											</TableCell>
											<TableCell>
												{rec.description || "-"}
											</TableCell>
											<TableCell>{rec.addedBy}</TableCell>
											<TableCell>
												{rec.editedBy || "Not Edited"}
											</TableCell>
											<TableCell>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() =>
															onEdit(rec)
														}
														className="text-xs flex items-center gap-1"
													>
														<Pencil className="w-3 h-3" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="destructive"
														onClick={() =>
															onDelete(rec)
														}
														className="text-xs flex items-center gap-1"
													>
														<Trash2 className="w-3 h-3" />
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			)}
			{viewMode === "card" && (
				<div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center md:justify-start">
					{paginatedData.length === 0 ? (
						<Card className="animate-fade-in items-center justify-center flex w-full border-0">
							<CardContent className="p-8 text-center text-gray-500 dark:text-gray-300/80">
								<div className="flex flex-col items-center gap-3">
									<Coins className="w-12 h-12 text-gray-300 dark:text-300/80" />
									<span>No contributions found.</span>
								</div>
							</CardContent>
						</Card>
					) : (
						paginatedData.map((rec, idx) => (
							<Card
								key={idx}
								className="border border-gray-200 dark:border-gray-900 rounded-xl shadow-sm w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] flex flex-col min-w-[270px] md:max-w-[320px] animate-fade-in"
							>
								<CardContent className="flex flex-col justify-between h-full p-4 space-y-4">
									{/* Section 1 */}
									<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl">
										<div className="flex justify-between items-start">
											<div>
												<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300/80 mb-5">
													{rec.memberName}
												</h3>
												<p className="text-lg font-bold text-gray-700 dark:text-gray-300/80">
													{formatCurrency(rec.amount)}
												</p>
											</div>
											<p className="text-xs text-gray-500 dark:text-gray-300/70 whitespace-nowrap">
												{dateFormat === "relative"
													? formatDistanceToNow(
															new Date(rec.date),
															{
																addSuffix: true,
															}
													  ).replace(/^about\s/, "")
													: new Date(
															rec.date
													  ).toLocaleDateString()}
											</p>
										</div>
									</div>

									{/* Section 2 */}
									<div className="bg-gray-50 dark:bg-blue-400/5 p-4 rounded-xl space-y-2">
										{rec.description && (
											<div>
												<p className="text-[12px] font-medium text-gray-600 dark:text-gray-400/60">
													Description:
												</p>
												<p className="text-[12px] text-gray-800 dark:text-gray-300/80 opacity-80 my-3">
													{rec.description}
												</p>
											</div>
										)}
										<p className="text-[12px] text-gray-700 dark:text-gray-300/80">
											<span className="font-medium text-gray-600 dark:text-gray-400/60">
												Added by:
											</span>{" "}
											<span className="opacity-80">
												{rec.addedBy}
											</span>
										</p>
										<p className="text-[12px] text-gray-700 dark:text-gray-300/80">
											<span className="font-medium text-gray-600 dark:text-gray-400/60">
												Edited by:
											</span>{" "}
											<span className="opacity-80">
												{rec.editedBy || "Not Edited"}
											</span>
										</p>
									</div>

									{/* Footer - aligned at bottom */}
									<div className="flex gap-2 pt-2 mt-auto">
										<Button
											size="sm"
											variant="outline"
											className="text-xs flex-1 flex items-center gap-1 dark:text-gray-300/80"
											onClick={() => onEdit(rec)}
										>
											<Pencil className="w-3 h-3" /> Edit
										</Button>
										<Button
											size="sm"
											variant="destructive"
											className="text-xs flex-1 flex items-center gap-1 dark:text-gray-300/80"
											onClick={() => onDelete(rec)}
										>
											<Trash2 className="w-3 h-3" />{" "}
											Delete
										</Button>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 bg-white/90 dark:bg-background dark:border-gray-900">
					<div className="flex items-center gap-2 text-sm">
						<span className="text-gray-500">Items per page:</span>
						<Select
							value={String(itemsPerPage)}
							onValueChange={(value) =>
								handleItemsPerPageChange(Number(value))
							}
						>
							<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-400/5 dark:text-blue-300/80 rounded-full uppercase font-semibold tracking-widest w-[110px] hover:bg-blue-100 flex justify-center">
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
										if (currentPage > 1)
											handlePageChange(currentPage - 1);
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
											handlePageChange(i + 1);
										}}
										className="dark:hover:bg-blue-400/5"
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
										if (currentPage < totalPages)
											handlePageChange(currentPage + 1);
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	);
};

export default ContributionsTable;
