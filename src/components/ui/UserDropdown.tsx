import { useState, useRef, useEffect } from "react";
import {
	ChevronDown,
	LogOut,
	Shield,
	User as UserIcon,
	CheckCircle,
} from "lucide-react";
import type { Member } from "@/types/types";

interface UserDropdownProps {
	user: Member;
	onLogout: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
	user,
	onLogout,
}) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

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

	const canApply = user.loanEligible && user.canApplyForLoan;

	return (
		<div className="relative ml-auto" ref={dropdownRef}>
			{/* Trigger Button */}
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-all group"
			>
				{/* Avatar */}
				<div className="relative w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner">
					{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
					{/* Status Dot (Optional) */}
					<span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full" />
				</div>

				{/* User Info */}
				<div className="hidden md:flex flex-col text-left leading-tight text-sm">
					<span className="font-semibold text-gray-900 group-hover:text-gray-800">
						{user?.name || "User"}
					</span>
					<span className="text-xs text-gray-500 truncate max-w-[140px]">
						{user?.email}
					</span>
				</div>

				{/* Icon */}
				<ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-500" />
			</button>

			{/* Dropdown Panel */}
			<div
				className={`absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 transform transition-all duration-200 ${
					open
						? "opacity-100 scale-100"
						: "opacity-0 scale-95 pointer-events-none"
				}`}
			>
				{/* Header */}
				<div className="px-5 py-4 border-b border-gray-100">

					{/* Role & Join Date */}
					<div className="mt-3 space-y-1 text-sm text-gray-700">
						<div className="flex items-center gap-2 font-medium">
							{user.role === "admin" ? (
								<Shield size={14} className="text-blue-500" />
							) : (
								<UserIcon size={14} className="text-gray-500" />
							)}
							<span className="capitalize">{user.role}</span>
						</div>
						<p className="text-xs text-gray-400">
							Joined on{" "}
							{new Date(user.joinDate).toLocaleDateString()}
						</p>

						{canApply && (
							<div className="flex items-center gap-2 text-green-600 text-sm mt-1">
								<CheckCircle
									size={14}
									className="text-green-500"
								/>
								<span>Eligible for a loan</span>
							</div>
						)}
					</div>
				</div>

				{/* Menu Items */}
				<ul className="py-2 text-sm text-gray-700">
					<li>
						<button
							onClick={onLogout}
							className="flex w-full items-center gap-3 px-5 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-none"
						>
							<LogOut size={16} />
							<span>Logout</span>
						</button>
					</li>
					{/* Add more menu options here */}
					{/* <li>
						<a href="#" className="flex items-center gap-3 px-5 py-2 hover:bg-gray-100">
							<Settings size={16} />
							<span>Settings</span>
						</a>
					</li> */}
				</ul>
			</div>
		</div>
	);
};
