import React from "react";
import { ToggleRight, ToggleLeft } from "lucide-react";
import type { Member } from "../../types/types";

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
	<span
		className={
			"absolute right-3 top-3 flex items-center gap-1 text-xs font-medium bg-white/80 px-2 py-1 rounded-full shadow-sm " +
			(isActive ? "text-green-600" : "text-red-500")
		}
	>
		{isActive ? (
			<>
				<ToggleRight size={14} className="text-green-600" />
				Active
			</>
		) : (
			<>
				<ToggleLeft size={14} className="text-red-500" />
				Inactive
			</>
		)}
	</span>
);

export default StatusBadge;
