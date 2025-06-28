import { History, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useEffect, useMemo, useState } from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { AdminActivityLog } from "@/types/types";

interface AdminRecentActivityProps {
	activities: AdminActivityLog[];
	defaultItemsPerPage?: number;
}

const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({
	activities,
	defaultItemsPerPage = 10,
}) => {
	const [activityPage, setActivityPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
	const [searchTerm, setSearchTerm] = useState("");
	const [dateFormat, setDateFormat] = useState<"default" | "relative">(
		"relative"
	);
	const [searchStatus, setSearchStatus] = useState<
		"idle" | "typing" | "done"
	>("idle");

	useEffect(() => {
		if (searchTerm === "") {
			setSearchStatus("idle");
			return;
		}
		setSearchStatus("typing");
		const timeout = setTimeout(() => setSearchStatus("done"), 600);
		return () => clearTimeout(timeout);
	}, [searchTerm]);

	const filteredAndSortedActivities = useMemo(() => {
		const search = searchTerm.toLowerCase();
		return [...activities]
			.filter(
				(a) =>
					a.adminName?.toLowerCase().includes(search) ||
					a.type.toLowerCase().includes(search)
			)
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() -
					new Date(a.timestamp).getTime()
			);
	}, [activities, searchTerm]);

	const totalPages = Math.ceil(
		filteredAndSortedActivities.length / itemsPerPage
	);

	const paginatedActivities = useMemo(() => {
		const startIdx = (activityPage - 1) * itemsPerPage;
		return filteredAndSortedActivities.slice(
			startIdx,
			startIdx + itemsPerPage
		);
	}, [filteredAndSortedActivities, activityPage, itemsPerPage]);

	return (
		<div
			className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col"
			style={{ height: "calc(100vh - 200px)" }}
		>
			{/* Header */}
			<div className="p-6 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
				<h2 className="text-sm font-semibold text-gray-500">
					{activities.length} Admin Activities
				</h2>
				<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:min-w-[320px]">
					{/* Search */}
					<div className="relative w-full">
						<Search
							size={16}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10"
						/>
						<Input
							className="pl-9 pr-8 h-9 py-[19px] rounded-md text-sm border border-gray-300 focus-visible:ring-emerald-300 w-full"
							placeholder="Search by admin or type"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setActivityPage(1);
							}}
						/>
						<div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 z-10">
							{searchStatus === "typing" ? (
								<svg
									className="animate-spin h-4 w-4 text-gray-400"
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
								<Check size={16} className="text-emerald-600" />
							) : null}
						</div>
					</div>

					{/* Date format toggle */}
					<Select
						value={dateFormat}
						onValueChange={(val) =>
							setDateFormat(val as "default" | "relative")
						}
					>
						<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold tracking-widest w-[130px] hover:bg-blue-100 flex justify-center">
							<SelectValue />
						</SelectTrigger>
						<SelectContent side="top">
							<SelectItem value="default">Default</SelectItem>
							<SelectItem value="relative">Relative</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Activity List */}
			<div className="flex-1 flex flex-col min-h-0">
				<div className="flex-1 overflow-y-auto divide-y divide-gray-100">
					{filteredAndSortedActivities.length === 0 ? (
						<div className="py-12 flex justify-center items-center text-gray-400">
							<History className="mr-2 w-6 h-6" />
							<span>No matching activity</span>
						</div>
					) : (
						<ol className="flex flex-col">
							{paginatedActivities.map((act, idx) => (
								<li
									key={act.id}
									className={cn(
										`flex items-start gap-4 px-6 py-4 animate-fade-in relative group`,
										idx === 0 && activityPage === 1
											? "bg-emerald-50/60 border-l-4 border-emerald-500 shadow-md"
											: "",
										"hover:bg-emerald-100/40 transition-all"
									)}
									style={{
										animationDelay: `${idx * 50}ms`,
										animationFillMode: "both",
									}}
								>
									<div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50">
										<History
											size={26}
											className={`text-${
												act.color || "gray"
											}-500`}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex flex-col min-[494px]:flex-row min-[494px]:items-center gap-1 min-[494px]:gap-2 mb-1">
											<span className="font-bold text-emerald-700 text-base">
												{act.adminName || "Admin"}
											</span>
											<span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
												{act.adminEmail}
											</span>
										</div>
										<div className="text-gray-800 text-[13px] mb-2">
											{act.text}
										</div>
										<div className="flex justify-end items-center gap-x-4 text-xs text-gray-500">
											<span
												className={`px-2 py-0.5 rounded-full bg-${
													act.color || "gray"
												}-100 text-${
													act.color || "gray"
												}-700 capitalize`}
											>
												{act.type.replace(/_/g, " ")}
											</span>
											<span>
												{dateFormat === "relative"
													? formatDistanceToNow(
															new Date(
																act.timestamp
															),
															{
																addSuffix: true,
															}
													  ).replace(/^about\s/, "")
													: new Date(
															act.timestamp
													  ).toLocaleString()}
											</span>
										</div>
									</div>
								</li>
							))}
						</ol>
					)}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 py-3 px-4 border-t border-gray-100 bg-white/90 flex-shrink-0">
						<div className="flex items-center gap-2 text-sm">
							<span className="text-gray-500">
								Items per page:
							</span>
							<Select
								value={String(itemsPerPage)}
								onValueChange={(value) => {
									setItemsPerPage(Number(value));
									setActivityPage(1);
								}}
							>
								<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full uppercase font-semibold tracking-widest w-[110px] hover:bg-blue-100 flex justify-center">
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
										aria-disabled={activityPage === 1}
										tabIndex={activityPage === 1 ? -1 : 0}
										onClick={(e) => {
											e.preventDefault();
											setActivityPage((prev) =>
												Math.max(1, prev - 1)
											);
										}}
									/>
								</PaginationItem>
								{Array.from({ length: totalPages }).map(
									(_, i) => (
										<PaginationItem key={i}>
											<PaginationLink
												href="#"
												isActive={
													activityPage === i + 1
												}
												onClick={(e) => {
													e.preventDefault();
													setActivityPage(i + 1);
												}}
											>
												{i + 1}
											</PaginationLink>
										</PaginationItem>
									)
								)}
								<PaginationItem>
									<PaginationNext
										href="#"
										aria-disabled={
											activityPage === totalPages
										}
										tabIndex={
											activityPage === totalPages ? -1 : 0
										}
										onClick={(e) => {
											e.preventDefault();
											setActivityPage((prev) =>
												Math.min(totalPages, prev + 1)
											);
										}}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminRecentActivity;
