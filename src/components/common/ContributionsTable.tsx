import React, { useState, useEffect, useMemo } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "../ui/pagination";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
	Coins,
	Pencil,
	Trash2,
	Search,
	Check,
	List,
	Grid,
	User2Icon,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";
import { Contribution } from "@/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/utils/calculations";
import { formatWithOrdinal } from "@/lib/utils";
import CardView from "./contributions/CardView";
import SearchComponent from "./Search";

interface ContributionRecord extends Contribution {
	memberName: string;
}

interface ContributionsTableProps {
	readOnly: boolean;
	data: ContributionRecord[];
	page: number;
	totalPages: number;
	onEdit: (rec: ContributionRecord) => void;
	onDelete: (rec: ContributionRecord) => void;
	onPageChange: (page: number) => void;
}

const ContributionsTable: React.FC<ContributionsTableProps> = ({
	readOnly,
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

	const [sortBy, setSortBy] = useState<keyof ContributionRecord | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

	const sortedData = useMemo(() => {
		const sorted = [...filteredData];
		if (sortBy) {
			sorted.sort((a, b) => {
				const aVal: unknown = a[sortBy];
				const bVal: unknown = b[sortBy];

				if (aVal == null) return 1;
				if (bVal == null) return -1;

				if (typeof aVal === "number" && typeof bVal === "number") {
					return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
				}

				if (aVal instanceof Date && bVal instanceof Date) {
					return sortDirection === "asc"
						? aVal.getTime() - bVal.getTime()
						: bVal.getTime() - aVal.getTime();
				}

				return sortDirection === "asc"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		}
		return sorted;
	}, [filteredData, sortBy, sortDirection]);

	const totalPages = Math.ceil(filteredData.length / itemsPerPage);

	const paginatedData = useMemo(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return sortedData.slice(startIdx, startIdx + itemsPerPage);
	}, [sortedData, currentPage, itemsPerPage]);

	const handleSort = (column: keyof ContributionRecord) => {
		if (sortBy === column) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(column);
			setSortDirection("asc");
		}
	};

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
					<SearchComponent
						searchTerm={searchTerm}
						searchStatus={searchStatus}
						setSearchTerm={setSearchTerm}
					/>
				</div>

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
			</div>

			{/* Table View */}
			{viewMode === "table" && (
				<div className="hidden md:block animate-fade-in">
					<div className="rounded-xl border border-gray-200 dark:border-gray-900 shadow-sm overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-background">
									<TableHead
										onClick={() => handleSort("memberName")}
										className="cursor-pointer select-none"
									>
										Member{" "}
										{sortBy === "memberName" &&
											(sortDirection === "asc"
												? "↑"
												: "↓")}
									</TableHead>
									<TableHead
										onClick={() => handleSort("amount")}
										className="cursor-pointer select-none"
									>
										Amount{" XAF "}
										{sortBy === "amount" &&
											(sortDirection === "asc"
												? "↑"
												: "↓")}
									</TableHead>
									<TableHead
										onClick={() => handleSort("createdAt")}
										className="cursor-pointer select-none"
									>
										Date{" "}
										{sortBy === "createdAt" &&
											(sortDirection === "asc"
												? "↑"
												: "↓")}
									</TableHead>

									<TableHead>Description</TableHead>
									<TableHead>Added By</TableHead>
									<TableHead>Edited By</TableHead>
									{!readOnly && (
										<TableHead>Actions</TableHead>
									)}
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
											className="hover:bg-gray-50 dark:hover:bg-blue-400/5 animate-fade-in dark:text-gray-300/80"
											style={{
												animationDelay: `${idx * 50}ms`,
												animationFillMode: "both",
											}}
										>
											<TableCell className="flex">
												<User2Icon
													size={18}
													className="mr-2"
												/>
												{rec.memberName}
											</TableCell>
											<TableCell>
												<p className="flex">
													<Coins
														size={18}
														className="mr-2"
													/>
													{formatCurrency(
														rec.amount
													).replace(" XAF", "")}
												</p>
											</TableCell>
											<TableCell>
												{dateFormat === "relative"
													? formatDistanceToNow(
															new Date(rec.createdAt),
															{
																addSuffix: true,
															}
													  ).replace(/^about\s/, "")
													: formatWithOrdinal(
															new Date(rec.createdAt)
													  )}
											</TableCell>
											<TableCell>
												{rec.description || "-"}
											</TableCell>
											<TableCell>{rec.addedBy}</TableCell>
											<TableCell>
												{rec.editedBy || "Not Edited"}
											</TableCell>
											<TableCell>
												{!readOnly && (
													<div className="flex gap-2">
														<Button
															size="sm"
															variant="outline"
															onClick={() =>
																onEdit(rec)
															}
															className="text-xs flex items-center gap-1"
														>
															<Pencil className="w-3 h-3" />{" "}
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
															<Trash2 className="w-3 h-3" />{" "}
															Delete
														</Button>
													</div>
												)}
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
				<CardView
					paginatedData={paginatedData}
					readOnly={readOnly}
					dateFormat={dateFormat}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
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
