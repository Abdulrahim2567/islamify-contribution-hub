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

type TabKey = "admin" | "contribution" | "loan";

interface NotificationDropdownProps {
	notifications: AdminActivityLog[];
	contributions?: ContributionRecordActivity[];
	memberLoans?: MemberLoanActivity[];
	user: Member;
	itemsPerPage?: number;
}

type LoanActivityItem = {
	id: number;
	timestamp: string;
	text: string;
	color: string;
	adminName?: string;
	memberName?: string;
	type?: string;
};

const READ_IDS_STORAGE_KEY = "NOTIFICATION_READ_IDS";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
	notifications,
	contributions = [],
	memberLoans = [],
	user,
	itemsPerPage = 5,
}) => {
	const [open, setOpen] = useState(false);
	const defaultTab: TabKey = user.role === "admin" ? "admin" : "contribution";
	const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

	// page per tab, persist page number per tab
	const [tabPages, setTabPages] = useState<Record<TabKey, number>>({
		admin: 1,
		contribution: 1,
		loan: 1,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [readIds, setReadIds] = useState<Set<number>>(new Set());

	// loans mapping
	const loans: LoanActivityItem[] =
		memberLoans.map((l) => ({
			id: l.memberId,
			timestamp: l.date,
			text: l.description,
			color: "amber",
			memberName: l.memberName,
			type: l.type,
		})) ?? [];

	const markCurrentTabAsRead = () => {
		let idsToMark: number[] = [];
		if (activeTab === "admin") idsToMark = notifications.map((n) => n.id);
		else if (activeTab === "contribution")
			idsToMark = contributions.map((c) => c.id);
		else if (activeTab === "loan") idsToMark = loans.map((l: any) => l.id);
		setReadIds((prev) => new Set([...prev, ...idsToMark]));
	};

	useEffect(() => {
		if (!(activeTab in allTabs)) {
			setActiveTab(defaultTab);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, activeTab, defaultTab]);

	useEffect(() => {
		const stored = localStorage.getItem(READ_IDS_STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					setReadIds(new Set(parsed));
				}
			} catch {
				console.warn("Failed to parse stored read IDs");
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			READ_IDS_STORAGE_KEY,
			JSON.stringify([...readIds])
		);
	}, [readIds]);

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
		if (open) {
			markCurrentTabAsRead();
		}
	}, [open, activeTab]);

	// Filtering helper
	const filterBySearch = <
		T extends {
			text?: string;
			description?: string;
			adminName?: string;
			memberName?: string;
		}
	>(items: T[]): T[] => {
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
							new Date(b.timestamp).getTime() -
							new Date(a.timestamp).getTime()
					)
				),
				unreadCount: notifications.filter((n) => !readIds.has(n.id))
					.length,
			},
		}),
		contribution: {
			label: "Contribution Activities",
			color: tabColors.contribution,
			items: filterBySearch(
				[...contributions].sort(
					(a, b) =>
						new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			),
			unreadCount: contributions.filter((n) => !readIds.has(n.id)).length,
		},
		loan: {
			label: "Loan Activities",
			color: tabColors.loan,
			items: filterBySearch(
				[...loans].sort(
					(a, b) =>
						new Date(b.timestamp).getTime() -
						new Date(a.timestamp).getTime()
				)
			),
			unreadCount: loans.filter((n) => !readIds.has(n.id)).length,
		},
	};
	

	const currentTab = allTabs[activeTab];

	// IMPORTANT: Use page number from tabPages state keyed by activeTab
	const page = tabPages[activeTab] || 1;

	const totalPages = Math.ceil(currentTab.items.length / itemsPerPage);

	const paginatedItems = currentTab.items.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	const changePage = (newPage: number) => {
		if (newPage < 1 || newPage > totalPages) return; // safety check
		setTabPages((prev) => ({ ...prev, [activeTab]: newPage }));
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setOpen(!open)}
				className="relative inline-flex items-center p-2 text-gray-500 hover:text-gray-900 transition-colors"
			>
				<Bell className="w-5 h-5 mt-2" />
				{Object.values(allTabs).some((tab) => tab.unreadCount > 0) && (
					<span className="absolute -top-1 right-0 w-2.5 h-2.5 mt-3 bg-red-500 border-2 border-white rounded-full" />
				)}
			</button>

			<div
				className={clsx(
					"absolute right-0 mt-2 w-[28rem] max-w-sm bg-white border border-gray-200 rounded-lg shadow-xl z-50 transition-all duration-200",
					open
						? "opacity-100 scale-100"
						: "opacity-0 scale-95 pointer-events-none"
				)}
			>
				{/* Header */}
				<div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
					<div className="font-semibold text-gray-700 mb-2 flex items-center justify-between">
						<span>Notifications</span>
					</div>
					<div className="flex gap-1 mb-2">
						{Object.entries(allTabs).map(([key, tab]) => {
							const color = tabColors[key as TabKey];
							return (
								<button
									key={key}
									className={clsx(
										"px-3 py-1 rounded-full text-xs font-medium transition-colors",
										activeTab === key
											? "bg-emerald-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									)}
									onClick={() => {
										setActiveTab(key as TabKey);
										// Reset search and keep page or reset page for new tab
										setSearchTerm("");
										// Optionally reset page to 1 when switching tabs:
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
							);
						})}
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Search..."
							className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								// Reset page to 1 when search changes
								setTabPages((prev) => ({
									...prev,
									[activeTab]: 1,
								}));
							}}
						/>
					</div>
				</div>

				{/* Notifications */}
				<div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
					{paginatedItems.length === 0 ? (
						<div className="py-12 flex justify-center items-center text-gray-400">
							<History className="mr-2 w-5 h-5" />
							<span>No notifications</span>
						</div>
					) : (
						paginatedItems.map((item: any, index: number) => {
							const id = item.id ?? index;
							const title =
								item.adminName || item.memberName || "System";
							const text = item.text || item.description || "";
							const timestamp = item.timestamp || item.date;
							const badge = item.type?.replace(/_/g, " ");
							const color = item.color || tabColors[activeTab];
							return (
								<div
									key={`notif-${id}`}
									className="flex gap-3 px-4 py-3 items-start hover:bg-gray-50 text-sm"
								>
									<div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
										<Bell
											className={`w-5 h-5 text-${color}-500`}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-medium text-gray-900">
												{title}
											</span>
										</div>
										<p className="text-gray-800 text-[13px]">
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
													className={`px-2 py-0.5 rounded-full capitalize bg-${color}-100 text-${color}-700 text-xs`}
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

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center py-3 border-t border-gray-100 bg-gray-50">
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
