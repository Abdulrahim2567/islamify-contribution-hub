import { Bell, History, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import {
	AdminActivityLog,
	ContributionRecordActivity,
	Member,
	MemberLoanActivity,
} from "@/types/types";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { formatDistanceToNow } from "date-fns";
import { colorMap } from "@/utils/colorMap";
import { cn } from "@/lib/utils";

type TabKey = "admin" | "contribution" | "loan";

type LoanActivityItem = {
	id: string;
	timestamp: string;
	text: string;
	color: string;
	adminName?: string;
	memberName?: string;
	type?: string;
};

interface NotificationDropdownProps {
	notifications: AdminActivityLog[];
	contributions?: ContributionRecordActivity[];
	memberLoans?: MemberLoanActivity[];
	user: Member;
	onUpdateReadNotifications: (
		memberId: string,
		updatedInfo: Partial<Member>
	) => void;
	itemsPerPage?: number;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	notifications,
	contributions = [],
	memberLoans = [],
	user,
	onUpdateReadNotifications,
	itemsPerPage = 5,
}) => {
	const [open, setOpen] = useState(false);
	const defaultTab: TabKey = user.role === "admin" ? "admin" : "contribution";
	const [activeTab, setActiveTab] = useState<TabKey>(() => {
		const saved = localStorage.getItem("notification_active_tab");
		if (saved === "admin" || saved === "contribution" || saved === "loan")
			return saved;
		return defaultTab;
	});

	const [tabPages, setTabPages] = useState<Record<TabKey, number>>({
		admin: 1,
		contribution: 1,
		loan: 1,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [readIds, setReadIds] = useState<Set<string>>(
		new Set(user.readNotifications || [])
	);

	const [shouldShake, setShouldShake] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const loans: LoanActivityItem[] = memberLoans.map((l) => ({
		id: l.memberId,
		timestamp: l.createdAt,
		text: l.description,
		color:
			l.type === "loan_request"
				? "emerald"
				: l.type === "loan_rejection"
				? "red"
				: "blue",
		memberName: l.memberName,
		type: l.type,
	}));
	const markCurrentTabAsRead = () => {
		let idsToMark: string[] = [];

		if (activeTab === "admin") idsToMark = notifications.map((n) => n._id);
		else if (activeTab === "contribution")
			idsToMark = contributions.map((c) => c._id);
		else if (activeTab === "loan") idsToMark = loans.map((l) => l.id);

		const currentRead = new Set(readIds); // Use current local state
		const newUnread = idsToMark.filter((id) => !currentRead.has(id));

		if (newUnread.length > 0) {
			const updated = new Set([...currentRead, ...newUnread]);

			// ✅ Update state immediately
			setReadIds(updated);

			// ✅ Persist just the new unread
			onUpdateReadNotifications(user._id, {
				readNotifications: newUnread,
			});
		}
	};

	useEffect(() => {
		if (!(activeTab in allTabs)) setActiveTab(defaultTab);
	}, [user, activeTab, defaultTab]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		if (!(activeTab in allTabs)) {
			setActiveTab(defaultTab);
		}
	}, [user, activeTab, defaultTab]);

	const filterBySearch = <
		T extends {
			text?: string;
			description?: string;
			adminName?: string;
			memberName?: string;
		}
	>(
		items: T[]
	): T[] => {
		return items.filter((item) => {
			const combined = [
				item.text,
				item.description,
				item.adminName,
				item.memberName,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return combined.includes(searchTerm.toLowerCase());
		});
	};

	const getContributionColor = (description: string) => {
		if (description.includes("Added")) return "emerald";
		if (description.includes("Deleted") || description.includes("Delete"))
			return "red";
		if (description.includes("Edited")) return "blue";
		if (description.includes("Edit Contribution")) return "cyan";
		if (description.includes("Changed")) return "purple";
		return "gray";
	};

	const tabColors: Record<TabKey, string> = {
		admin: "emerald",
		contribution: "indigo",
		loan: "amber",
	};

	const allTabs = {
		...(user.role === "admin" && {
			admin: {
				label: "Admin Activities",
				color: tabColors.admin,
				items: filterBySearch(
					[...notifications].sort(
						(a, b) =>
							new Date(b.createdAt).getTime() -
							new Date(a.createdAt).getTime()
					)
				),
				unreadCount: notifications.filter((n) => !readIds.has(n._id))
					.length,
			},
		}),
		contribution: {
			label: "Contribution Activities",
			color: tabColors.contribution,
			items: filterBySearch(
				[...contributions].sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
			),
			unreadCount: contributions.filter((n) => !readIds.has(n._id)).length,
		},
		loan: {
			label: "Loan Activities",
			color: tabColors.loan,
			items: filterBySearch(loans),
			unreadCount: loans.filter((n) => !readIds.has(n.id)).length,
		},
	};
	useEffect(() => {
		if (Object.values(allTabs).some((tab) => tab.unreadCount > 0)) {
			const interval = setInterval(() => {
				setShouldShake(true);
				setTimeout(() => setShouldShake(false), 600); // Duration matches animation
			}, 6000); // Every 6 seconds

			return () => clearInterval(interval);
		}
	}, []);

	useEffect(() => {
		if (open) {
			markCurrentTabAsRead();
		}
	}, [open]);

	const currentTab = allTabs[activeTab];
	if (!currentTab) return null;
	const page = tabPages[activeTab] || 1;
	const totalPages = Math.ceil(currentTab?.items.length / itemsPerPage);

	const paginatedItems =
		currentTab?.items.slice(
			(page - 1) * itemsPerPage,
			page * itemsPerPage
		) || [];

	const changePage = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return;
		setTabPages((prev) => ({ ...prev, [activeTab]: newPage }));
	};

	return (
		<div className="relative " ref={dropdownRef}>
			<button
				onClick={() => setOpen(!open)}
				className="relative inline-flex items-center p-2 text-gray-500 hover:text-gray-900 dark:text-gray-300/80 dark:hover:text-gray-600/80 transition-colors"
			>
				<Bell
					className={clsx(
						"w-5 h-5 mt-2",
						shouldShake && "animate-shake"
					)}
				/>

				{Object.values(allTabs).some((tab) => tab.unreadCount > 0) && (
					<span className="absolute top-0 right-0 w-2.5 h-2.5 mt-3 bg-blue-500 border-2 animate-pulse rounded-full" />
				)}
			</button>

			<div
				className={clsx(
					"absolute right-0 mt-2 w-[28rem] max-w-sm bg-background border border-gray-200 dark:border-gray-900 rounded-lg shadow-xl z-50 transition-all duration-200",
					open
						? "opacity-100 scale-100"
						: "opacity-0 scale-95 pointer-events-none"
				)}
			>
				<div className="px-4 py-3 border-b border-gray-100 dark:border-gray-900 bg-background">
					<div className="font-semibold text-gray-700 dark:text-gray-300/80 mb-2 flex items-center justify-between">
						<span>Notifications</span>
					</div>
					<div className="flex gap-1 mb-2">
						{Object.entries(allTabs).map(([key, tab]) => (
							<button
								key={key}
								className={clsx(
									"px-3 py-1 rounded-full text-xs font-medium transition-colors",
									activeTab === key
										? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white dark:bg-emerald-400/5 dark:text-emerald-300/80"
										: "bg-background  dark:text-gray-300/80 dark:hover:bg-emerald-400/5 dark:hover:text-emerald-300/80 hover:bg-gray-200/30 hover:text-black"
								)}
								onClick={() => {
									markCurrentTabAsRead();
									setActiveTab(key as TabKey);
									localStorage.setItem(
										"notification_active_tab",
										key
									);
									setSearchTerm("");
									setTabPages((prev) => ({
										...prev,
										[key as TabKey]:
											prev[key as TabKey] || 1,
									}));
								}}
							>
								{tab.label}
								{tab.unreadCount > 0 && (
									<span className="ml-2 text-xs font-semibold text-red-600">
										({tab.unreadCount})
									</span>
								)}
							</button>
						))}
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search..."
							className="w-full pl-9 pr-3 py-2 border-[2px] text-sm rounded-md border-gray-200 dark:border-gray-900 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setTabPages((prev) => ({
									...prev,
									[activeTab]: 1,
								}));
							}}
						/>
					</div>
				</div>

				<div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-900">
					{paginatedItems.length === 0 ? (
						<div className="py-12 flex justify-center items-center text-gray-400 dark:text-gray-300/80">
							<History className="mr-2 w-5 h-5" />
							<span>No notifications</span>
						</div>
					) : (
						paginatedItems.map((item: any, index: number) => {
							const id = item._id ?? index;
							const title =
								item.adminName || item.memberName || "System";
							const text = item.text || item.description || "";
							const timestamp = item.createdAt || item.createdAt;
							const badge = item.type?.replace(/_/g, " ");
							let color = item.color;
							if (activeTab === "contribution")
								color = getContributionColor(item.type);
							else if (activeTab === "loan") color = item.color;
							else color = item.color || tabColors[activeTab];
							return (
								<div
									key={`notif-${id}`}
									className={cn(
										"flex gap-3 px-4 py-3 items-start text-sm transition-colors",
										color === "emerald" &&
											"hover:bg-emerald-100/40 dark:hover:bg-emerald-500/5",
										color === "red" &&
											"hover:bg-red-100/40 dark:hover:bg-red-500/5",
										color === "blue" &&
											"hover:bg-blue-100/40 dark:hover:bg-blue-500/5",
										color === "indigo" &&
											"hover:bg-indigo-100/40 dark:hover:bg-indigo-500/5",
										color === "cyan" &&
											"hover:bg-cyan-100/40 dark:hover:bg-cyan-500/5",
										color === "violet" &&
											"hover:bg-violet-100/40 dark:hover:bg-violet-500/5",
										color === "purple" &&
											"hover:bg-purple-100/40 dark:hover:bg-purple-500/5",
										color === "lime" &&
											"hover:bg-lime-100/40 dark:hover:bg-lime-500/5",
										(color === "gray" ||
											color === "black") &&
											"hover:bg-gray-100/40 dark:hover:bg-gray-500/5"
									)}
								>
									<div
										className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center dark:bg-gradient-to-br dark:from-emerald-400/5 dark:to-blue-400/5`}
									>
										<Bell
											className={cn(
												"w-5 h-5",
												(
													colorMap[color] ??
													colorMap.gray
												).text
											)}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-gray-900 dark:text-gray-300/80">
												{title}
											</span>
										</div>
										<p className="text-gray-800 text-[13px] dark:text-gray-400/80">
											{text}
										</p>
										<div className="flex justify-between items-center mt-2 text-xs">
											<span className="text-gray-400">
												{formatDistanceToNow(
													new Date(timestamp),
													{
														addSuffix: true,
													}
												).replace(/^about\s/, "")}
											</span>
											{badge && (
												<span
													className={cn(
														"px-2 py-0.5 rounded-full capitalize text-xs",
														(
															colorMap[color] ??
															colorMap.gray
														).bg,
														(
															colorMap[color] ??
															colorMap.gray
														).text
													)}
												>
													{badge}
												</span>
											)}
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{totalPages > 1 && (
					<div className="flex justify-center py-3 border-t border-gray-100 dark:border-gray-900 bg-background">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										aria-disabled={page === 1}
										tabIndex={page === 1 ? -1 : 0}
										onClick={(e) => {
											e.preventDefault();
											changePage(page - 1);
										}}
									/>
								</PaginationItem>
								{[...Array(totalPages)].map((_, i) => {
									const showEllipsis =
										(i === 1 && page > 4) ||
										(i === totalPages - 2 &&
											page < totalPages - 3);
									if (showEllipsis) {
										return (
											<PaginationItem
												key={`ellipsis-${i}`}
											>
												<PaginationEllipsis />
											</PaginationItem>
										);
									}
									if (
										i === 0 ||
										i === totalPages - 1 ||
										(i >= page - 2 && i <= page + 1)
									) {
										return (
											<PaginationItem key={i}>
												<PaginationLink
													href="#"
													isActive={page === i + 1}
													onClick={(e) => {
														e.preventDefault();
														changePage(i + 1);
													}}
													className="hover:bg-blue-400/5 text-gray-800 dark:text-gray-300/80"
												>
													{i + 1}
												</PaginationLink>
											</PaginationItem>
										);
									}
									return null;
								})}
								<PaginationItem>
									<PaginationNext
										href="#"
										aria-disabled={page === totalPages}
										tabIndex={page === totalPages ? -1 : 0}
										onClick={(e) => {
											e.preventDefault();
											changePage(page + 1);
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
