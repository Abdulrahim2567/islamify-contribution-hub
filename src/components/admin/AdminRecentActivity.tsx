
import { History } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface Activity {
  id: number;
  timestamp: string;
  type: string;
  text: string;
  color?: string;
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
}

interface AdminRecentActivityProps {
  activities: Activity[];
  paginatedActivities: Activity[];
  totalPages: number;
  activityPage: number;
  onActivityPageChange: (page: number) => void;
}

const AdminRecentActivity: React.FC<AdminRecentActivityProps> = ({
  activities,
  paginatedActivities,
  totalPages,
  activityPage,
  onActivityPageChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <span className="text-xs text-gray-500">
          {activities.length} entries
        </span>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {activities.length === 0 ? (
            <div className="py-12 flex justify-center items-center text-gray-400">
              <History className="mr-2 w-6 h-6" />
              <span>No recent activity</span>
            </div>
          ) : (
            <ol className="flex flex-col">
              {paginatedActivities.map((act, idx) => (
                <li
                  key={act.id}
                  className={
                    `flex items-center gap-4 px-6 py-4 animate-fade-in relative group
                    ${idx === 0 && activityPage === 1 ? "bg-emerald-50/60 border-l-4 border-emerald-500 shadow-md": ""}
                    hover:bg-emerald-100/40 transition-all`
                  }
                  style={{
                    animationDelay: (idx * 50) + "ms",
                    animationFillMode: "both",
                  }}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50`}>
                    <History size={26} className={`text-${act.color || "gray"}-500`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-emerald-700 text-base">{act.adminName || "Admin"}</span>
                      <span className="ml-1 px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500">{act.adminEmail}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full bg-${act.color || "gray"}-100 text-${act.color || "gray"}-700 capitalize`}>
                        {act.type.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-gray-800 text-[13px]">{act.text}</div>
                  </div>
                  <span className="ml-auto text-xs text-gray-400 whitespace-nowrap">
                    {act.timestamp}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center py-3 border-t border-gray-100 bg-white/90 flex-shrink-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={activityPage === 1}
                    tabIndex={activityPage === 1 ? -1 : 0}
                    onClick={e => {
                      e.preventDefault();
                      onActivityPageChange(activityPage - 1);
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={activityPage === i + 1}
                      onClick={e => {
                        e.preventDefault();
                        onActivityPageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={activityPage === totalPages}
                    tabIndex={activityPage === totalPages ? -1 : 0}
                    onClick={e => {
                      e.preventDefault();
                      onActivityPageChange(activityPage + 1);
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
