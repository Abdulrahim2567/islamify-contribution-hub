import React from "react";
import { Member } from "../../../types/types";
import { User, Mail, Phone, X } from "lucide-react"; // Only these icons are allowed
import { CreditCard } from "lucide-react";

interface MemberDetailModalProps {
	member: Member | null;
	onClose: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
	member,
	onClose,
}) => {
	if (!member) return null;

	const avatarUrl =
		"https://ui-avatars.com/api/?name=" +
		encodeURIComponent(member.name) +
		"&background=10b981&color=fff&size=128";

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in">
			<div
				className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 sm:p-0 relative overflow-visible max-h-[95vh] flex flex-col
        animate-scale-in"
				// The modal can be animated by adding scale/fade transition utilities
			>
				{/* Close button (absolute, top-right) */}
				<button
					onClick={onClose}
					aria-label="Close"
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-[25px] h-fit w-fit bg-gray-100 hover:bg-gray-200 transition"
				>
					<X />
				</button>
				{/* Avatar section */}
				<div className="flex flex-col items-center justify-center -mt-14 mb-3">
					<div className="rounded-full bg-emerald-100 border-4 border-white shadow-md w-28 h-28 flex items-center justify-center overflow-hidden">
						<img
							src={avatarUrl}
							alt={member.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="mt-3 flex flex-col items-center">
						<span className="flex items-center gap-2 text-xl font-bold text-gray-900">
							<User size={22} className="text-emerald-600" />
							{member.name}
						</span>
						<span className="text-xs font-semibold text-gray-400 tracking-wide uppercase mt-0.5">
							{member.role}
						</span>
					</div>
				</div>

				{/* Main sections */}
				<div className="flex-1 flex flex-col gap-6 px-6 pb-6 overflow-y-auto">
					{/* Contact Info Card */}
					<div className="bg-gray-50 rounded-xl p-5 shadow-sm mb-2">
						<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
							Contact Information
						</h3>
						<div className="flex flex-col gap-3 text-gray-700">
							<div className="flex items-center gap-3">
								<Mail size={18} className="text-emerald-500" />
								<span className="truncate">{member.email}</span>
							</div>
							<div className="flex items-center gap-3">
								<Phone size={18} className="text-blue-500" />
								<span>{member.phone}</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-gray-500">
								<span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100">
									<CreditCard
										size={16}
										className="text-indigo-500"
									/>
								</span>
								<span>
									Joined on{" "}
									{new Date(
										member.joinDate
									).toLocaleDateString(undefined, {
										year: "numeric",
										month: "short",
										day: "numeric",
									})}
								</span>
							</div>
						</div>
					</div>

					{/* Financial Summary Card */}
					<div className="bg-gray-50 rounded-xl p-5 shadow-sm">
						<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
							Financial Summary
						</h3>
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<CreditCard
									size={20}
									className="text-emerald-600"
								/>
								<span className="font-semibold text-gray-700 flex-1">
									Contributions
								</span>
								<span className="font-bold text-gray-900">
									{member.totalContributions.toLocaleString()}{" "}
									XAF
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CreditCard
									size={20}
									className="text-indigo-600"
								/>
								<span className="font-semibold text-gray-700 flex-1">
									Registration Fee
								</span>
								<span className="font-bold text-gray-900">
									{member.registrationFee.toLocaleString()}{" "}
									XAF
								</span>
							</div>
							<div className="flex items-center gap-3">
								<CreditCard
									size={20}
									className="text-purple-600"
								/>
								<span className="font-semibold text-gray-700 flex-1">
									Max Loan
								</span>
								<span className="font-bold text-gray-900">
									{(
										member.totalContributions * 3
									).toLocaleString()}{" "}
									XAF
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberDetailModal;
