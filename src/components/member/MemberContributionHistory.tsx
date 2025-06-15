
import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, User, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";
const PER_PAGE = 10;

// Activity type used in admin dashboard
interface Activity {
  type: "contribution" | string;
  amount?: number;
  memberId?: number;
  memberName?: string;
  date: string;
  performedBy?: string;
  description?: string;
}

interface MemberContributionHistoryProps {
  memberId: number;
  memberName: string;
}

const MemberContributionHistory = ({ memberId, memberName }: MemberContributionHistoryProps) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Load activities from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
      if (stored) {
        setActivities(JSON.parse(stored));
      }
    } catch {
      setActivities([]);
    }
  }, []);

  // Filter for contributions for THIS member only (type: contribution && memberId matches)
  const filtered = activities
    .filter(
      (activity) =>
        activity.type === "contribution" &&
        typeof activity.memberId === "number" &&
        activity.memberId === memberId
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalCount = filtered.length;
  const maxPage = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // Responsive and modern UI like admin recent activities
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
      <div className="flex items-center px-6 pt-5 pb-2 gap-2">
        <History className="w-6 h-6 text-green-700" />
        <h2 className="font-bold text-lg text-gray-800">Contribution History</h2>
        <span className="ml-auto text-xs text-gray-500">
          {totalCount} entr{totalCount === 1 ? "y" : "ies"}
        </span>
      </div>
      <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        {paginated.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <TrendingUp className="w-12 h-12 mb-2" />
            <div className="text-base font-semibold">No contributions yet</div>
            <div className="text-sm">Your contribution activities added by the admin will show here.</div>
          </div>
        )}
        {paginated.map((activity, idx) => (
          <div className={`flex items-center gap-4 px-6 py-4 group transition-colors ${idx === 0 && currentPage === 1 ? "bg-emerald-50/50" : "hover:bg-gray-50"}`}
            key={activity.date + idx}>
            <div className="rounded-full bg-emerald-100 w-11 h-11 flex items-center justify-center shadow">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 items-center">
                <span className="font-semibold text-gray-800 truncate">
                  Admin added contribution
                </span>
                <Badge variant="outline" className="text-green-700 border-green-400 bg-green-50 ml-2">
                  +{activity.amount?.toLocaleString()} XAF
                </Badge>
              </div>
              <div className="text-xs text-gray-500 mt-0.5 truncate">
                {activity.description ? activity.description + " • " : ""}
                {new Date(activity.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </div>
              {activity.performedBy && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  By <span className="font-medium ml-0.5">{activity.performedBy || "Admin"}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {maxPage > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100">
          <button
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                : "text-green-700 hover:bg-emerald-50"
            } transition`}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="text-xs text-gray-500">
            Page {currentPage} of {maxPage}
          </span>
          <button
            disabled={currentPage === maxPage}
            className={`px-2 py-1 rounded text-sm font-medium ${
              currentPage === maxPage
                ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                : "text-green-700 hover:bg-emerald-50"
            } transition`}
            onClick={() => setCurrentPage((prev) => Math.min(maxPage, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberContributionHistory;
