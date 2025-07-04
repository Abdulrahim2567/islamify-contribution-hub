import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, User, History, RefreshCw, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContributionRecordActivity } from "@/types/types";
import { formatCurrency } from "@/utils/calculations";
import { useRecentActivities } from "@/hooks/useRecentActivities";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities_contributions";
const PER_PAGE = 10;

// Activity type used in admin dashboard
type Activity = ContributionRecordActivity;

interface MemberContributionHistoryProps {
	memberId: string;
	memberName: string;
}

const MemberContributionHistory = ({
	memberId,
	memberName,
}: MemberContributionHistoryProps) => {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const { getAllContributionsActivitiesForMember} = useRecentActivities()
	

	// Load activities from localStorage
	const loadActivities = (memberId: string) => {
		setIsLoading(true);
		try {
			const stored = getAllContributionsActivitiesForMember(memberId);
			if (stored) {
				setActivities(stored);
			} else {
				setActivities([]);
			}
		} catch (error) {
			console.error("Error loading activities:", error);
			setActivities([]);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		loadActivities(memberId);
	}, [memberId]);

	// Listen for storage changes to refresh data
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === ACTIVITY_LOCALSTORAGE_KEY) {
				loadActivities(memberId);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	// Filter for contributions for THIS member only (type: contribution && memberId matches)
	const filtered = activities.sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	const totalCount = filtered.length;
	const maxPage = Math.max(1, Math.ceil(totalCount / PER_PAGE));
	const paginated = filtered.slice(
		(currentPage - 1) * PER_PAGE,
		currentPage * PER_PAGE
	);

	// Responsive and modern UI like admin recent activities
	return (
		<div className="bg-background rounded-xl shadow-md border border-gray-100 dark:border-gray-900 overflow-hidden animate-fade-in">
			<div className="flex items-center px-6 pt-5 pb-2 gap-2">
				<History className="w-6 h-6 text-green-700" />
				<h2 className="font-bold text-lg text-gray-800">
					Contribution History
				</h2>
				<button
					onClick={() => loadActivities(memberId)}
					className="ml-auto p-1 hover:bg-gray-100 dark:hover:bg-blue-400/5 rounded-full transition-colors"
					title="Refresh contributions"
				>
					<RefreshCw
						className={`w-4 h-4 text-gray-500 dark:text-gray-300/80 ${
							isLoading ? "animate-spin" : ""
						}`}
					/>
				</button>
				<span className="text-xs text-gray-500 dark:text-gray-300/80">
					{totalCount} entr{totalCount === 1 ? "y" : "ies"}
				</span>
			</div>
			<div className="divide-y divide-gray-100 dark:divide-gray-900 max-h-96 overflow-y-auto">
				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-300/80">
						<RefreshCw className="w-8 h-8 mb-2 animate-spin" />
						<div className="text-sm">Loading contributions...</div>
					</div>
				) : paginated.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-300/80">
						<TrendingUp className="w-12 h-12 mb-2" />
						<div className="text-base font-semibold">
							No contributions yet
						</div>
						<div className="text-sm dark:text-gray-500/80">
							Your contribution activities added by the admin will
							show here.
						</div>
					</div>
				) : (
					paginated.map((activity, idx) => (
						<div
							className={`flex items-center gap-4 px-6 py-4 group transition-colors ${
								idx === 0 && currentPage === 1
									? "bg-emerald-50/50 dark:bg-emerald-300/5"
									: "hover:bg-gray-50 dark:hover:bg-emerald-400/5"
							}`}
							key={activity.createdAt + idx}
						>
							<div className="rounded-full bg-emerald-100 dark:bg-emerald-400/5 w-11 h-11 flex items-center justify-center shadow">
								<CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-300/80" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex gap-2 items-center">
									<span className="font-semibold text-gray-800 dark:text-gray-500/80 truncate">
										Admin added contribution
									</span>
									<Badge
										variant="outline"
										className="text-green-700 dark:text-green-500/80 border-green-400 dark:border-green/500/80 bg-green-50 dark:bg-green-400/5 ml-2"
									>
										+{formatCurrency(activity.amount)}
									</Badge>
								</div>
								<div className="text-xs text-gray-500 dark:text-gray-400/80 mt-0.5 truncate">
									{activity.description
										? activity.description + " • "
										: ""}
									{new Date(activity.createdAt).toLocaleString(
										undefined,
										{
											dateStyle: "medium",
											timeStyle: "short",
										}
									)}
								</div>
								{activity.addedBy && (
									<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-600/80 mt-1">
										<Shield className="w-3.5 h-3.5 text-gray-400 dark:text-gray-300/80" />
										By{" "}
										<span className="font-medium ml-0.5">
											{activity.addedBy || "Admin"}
										</span>
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>
			{maxPage > 0 && (
				<div className="flex items-center justify-between px-6 py-3 bg-background border-t border-gray-100 dark:border-gray-900">
					<button
						disabled={currentPage === 1}
						className={`px-2 py-1 rounded text-sm font-medium ${
							currentPage === 1
								? "text-muted bg-background cursor-not-allowed"
								: "text-green-700 dark:text-green-300/80 hover:bg-emerald-50 dark:hover:bg-emerald-400/5"
						} transition`}
						onClick={() =>
							setCurrentPage((prev) => Math.max(1, prev - 1))
						}
					>
						Previous
					</button>
					<span className="text-xs text-gray-500 dark:text-gray-300/80">
						Page {currentPage} of {maxPage}
					</span>
					<button
						disabled={currentPage === maxPage}
						className={`px-2 py-1 rounded text-sm font-medium ${
							currentPage === maxPage
								? "text-muted bg-background cursor-not-allowed"
								: "text-green-700 dark:text-green-300/80 hover:bg-emerald-50 dark:hover:bg-emerald-400/5"
						} transition`}
						onClick={() =>
							setCurrentPage((prev) =>
								Math.min(maxPage, prev + 1)
							)
						}
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
};

export default MemberContributionHistory;
