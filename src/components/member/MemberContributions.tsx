
import { useState, useEffect } from "react";
import { CreditCard, TrendingUp, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MemberContributionHistory from "./MemberContributionHistory";
import { markNotificationsAsRead } from "../../utils/notifications";

const ACTIVITY_LOCALSTORAGE_KEY = "islamify_recent_activities";

interface MemberContributionsProps {
  memberId: number;
  memberName: string;
}

const MemberContributions = ({ memberId, memberName }: MemberContributionsProps) => {
  const [memberActivities, setMemberActivities] = useState([]);

  // Mark contribution notifications as read when viewing this tab
  useEffect(() => {
    markNotificationsAsRead(memberId, 'contribution');
  }, [memberId]);

  // Load member's contributions
  useEffect(() => {
    try {
      const storedActivities = localStorage.getItem(ACTIVITY_LOCALSTORAGE_KEY);
      if (storedActivities) {
        const allActivities = JSON.parse(storedActivities);
        const filtered = allActivities
          .filter(
            (a) =>
              a.type === "contribution" &&
              typeof a.memberId === "number" &&
              a.memberId === memberId
          );
        setMemberActivities(filtered);
      } else {
        setMemberActivities([]);
      }
    } catch (err) {
      console.log("Failed to read member activities", err);
      setMemberActivities([]);
    }
  }, [memberId]);

  const totalContributions = memberActivities.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Contributions</h1>
        <p className="text-gray-600">Track your contribution history and total savings</p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="animate-fade-in border-l-4 border-l-emerald-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              Total Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-600">{totalContributions.toLocaleString()} XAF</p>
            <p className="text-sm text-gray-500 mt-1">{memberActivities.length} contributions made</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{memberActivities.length > 0 ? memberActivities.length : 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total contribution records</p>
          </CardContent>
        </Card>
      </div>

      {/* Contribution History */}
      <MemberContributionHistory
        memberId={memberId}
        memberName={memberName}
      />
    </div>
  );
};

export default MemberContributions;
