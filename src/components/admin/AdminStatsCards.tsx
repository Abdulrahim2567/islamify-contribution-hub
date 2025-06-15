
import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";

interface AdminStatsCardsProps {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  totalContributions: number;
  totalRegistrationFees: number;
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  totalMembers,
  activeMembers,
  inactiveMembers,
  totalContributions,
  totalRegistrationFees,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            <p className="text-xs text-gray-500 mt-1">
              Active: {activeMembers} &bull; Inactive: {inactiveMembers}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Contributions</p>
            <p className="text-2xl font-bold text-gray-900">{totalContributions.toLocaleString()} XAF</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Registration Fees</p>
            <p className="text-2xl font-bold text-gray-900">{totalRegistrationFees.toLocaleString()} XAF</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Funds</p>
            <p className="text-2xl font-bold text-gray-900">{(totalContributions + totalRegistrationFees).toLocaleString()} XAF</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCards;

