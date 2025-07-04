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
import { colorMap } from "@/utils/colorMap";
import SearchComponent from "@/components/common/Search";
import { PaginationControls } from "@/components/common/PaginationControls";

interface AdminRecentActivityProps {
	activities: AdminActivityLog[];
	defaultItemsPerPage?: number;
}

// Safe color map for Tailwind colors

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
		<div className="rounded-xl shadow-sm border border-gray-200 dark:border-gray-900 flex flex-col max-h-[calc(100dvh-180px)]">
			{/* Header */}
			<div className="p-6 border-b border-gray-200 dark:border-gray-900 flex items-center justify-between flex-wrap gap-3">
				<h2 className="text-sm font-semibold text-gray-500">
					{activities.length} Admin Activities
				</h2>
				<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:min-w-[320px]">
					{/* Search */}
					<SearchComponent
						searchTerm={searchTerm}
						searchStatus={searchStatus}
						setSearchTerm={setSearchTerm}
					/>

					{/* Date format toggle */}
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
			</div>

			{/* Activity List */}
			<div className="flex-1 flex flex-col min-h-0">
				<div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-100">
					{filteredAndSortedActivities.length === 0 ? (
						<div className="py-12 flex justify-center items-center text-gray-400">
							<History className="mr-2 w-6 h-6" />
							<span>No matching activity</span>
						</div>
					) : (
						<ol className="flex flex-col">
							{paginatedActivities.map((act, idx) => {
								const color =
									colorMap[act.color] ?? colorMap["gray"];
								return (
									<li
										key={act.id}
										className={cn(
											"flex items-start gap-4 px-6 py-4 animate-fade-in relative group transition-all",
											idx === 0 && activityPage === 1
												? `${color.bg} border-l-4 ${color.border} shadow-md`
												: "",
											act.color === "emerald" &&
												"hover:bg-emerald-100/40 dark:hover:bg-emerald-500/5",
											act.color === "red" &&
												"hover:bg-red-100/40 dark:hover:bg-red-500/5",
											act.color === "blue" &&
												"hover:bg-blue-100/40 dark:hover:bg-blue-500/5",
											act.color === "indigo" &&
												"hover:bg-indigo-100/40 dark:hover:bg-indigo-500/5",
											act.color === "cyan" &&
												"hover:bg-cyan-100/40 dark:hover:bg-cyan-500/5",
											act.color === "violet" &&
												"hover:bg-violet-100/40 dark:hover:bg-violet-500/5",
											act.color === "purple" &&
												"hover:bg-purple-100/40 dark:hover:bg-purple-500/5",
											act.color === "lime" &&
												"hover:bg-lime-100/40 dark:hover:bg-lime-500/5",
											(act.color === "gray" ||
												act.color === "black") &&
												"hover:bg-gray-100/40 dark:hover:bg-gray-500/5"
										)}
										style={{
											animationDelay: `${idx * 50}ms`,
											animationFillMode: "both",
										}}
									>
										<div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 dark:from-emerald-500/10 dark:via-blue-500/10 dark:to-indigo-500/10">
											<History
												size={26}
												className={color.text}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
												<span
													className={cn(
														"font-bold text-base",
														color.text
													)}
												>
													{act.adminName || "Admin"}
												</span>
												<span className="text-xs text-gray-500 dark:text-gray-400 rounded-3xl bg-gray-100 dark:bg-gray-500/10 px-2 py-0.5">
													{act.adminEmail}
												</span>
											</div>
											<div className="text-gray-800 dark:text-gray-200/60 text-[13px] mb-2">
												{act.text}
											</div>
											<div className="flex justify-end items-center gap-x-4 text-xs text-gray-500">
												<span
													className={cn(
														"px-2 py-0.5 rounded-full capitalize",
														color.bg,
														color.text
													)}
												>
													{act.type.replace(
														/_/g,
														" "
													)}
												</span>
												<span>
													{dateFormat === "relative"
														? formatDistanceToNow(
																new Date(
																	act.timestamp
																),
																{
																	addSuffix:
																		true,
																}
														  ).replace(
																/^about\s/,
																""
														  )
														: new Date(
																act.timestamp
														  ).toLocaleString()}
												</span>
											</div>
										</div>
									</li>
								);
							})}
						</ol>
					)}
				</div>
 
				{/* Pagination */}
				{totalPages > 1 && (
					<PaginationControls
						totalPages={totalPages}
						itemsPerPage={itemsPerPage}
						setCurrentPage={setActivityPage}
						currentPage={activityPage}
						setItemsPerPage={setItemsPerPage}
					/>
				)}
			</div>
		</div>
	);
};

export default AdminRecentActivity;
