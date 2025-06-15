
import React from "react";
import { Mail, Phone, CreditCard, User } from "lucide-react";
import type { Member } from "./types";

const MemberInfoSection = ({ member }: { member: Member }) => {
  const maxLoanAmount = member.totalContributions * 3;

  return (
    <div className="flex flex-col gap-2 px-5 pt-4 pb-5 flex-1 justify-between">
      {/* Email & phone */}
      <div className="flex flex-col gap-1 text-gray-600 dark:text-gray-300 text-sm">
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-emerald-400" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={15} className="text-blue-400" />
          <span>{member.phone}</span>
        </div>
      </div>
      {/* Contribution and Max loan */}
      <div className="flex items-center gap-6 w-full justify-between mt-3">
        <div className="flex flex-col items-center flex-1">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <CreditCard size={13} className="text-indigo-400" />
            Contribution
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">{member.totalContributions.toLocaleString()} XAF</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <CreditCard size={13} className="text-purple-400" />
            Max Loan
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">{maxLoanAmount.toLocaleString()} XAF</span>
        </div>
      </div>
    </div>
  );
};

export default MemberInfoSection;
