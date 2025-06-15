
import React from "react";
import { Member } from "./types";

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email: {member.email}</p>
              <p className="text-sm text-gray-600">Phone: {member.phone}</p>
              <p className="text-sm text-gray-600">
                Joined: {new Date(member.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Financial Summary</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Contributions: {member.totalContributions.toLocaleString()} XAF
              </p>
              <p className="text-sm text-gray-600">
                Registration Fee: {member.registrationFee.toLocaleString()} XAF
              </p>
              <p className="text-sm text-gray-600">
                Max Loan: {(member.totalContributions * 3).toLocaleString()} XAF
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
