import { useMembers } from "@/hooks/useMembers";
import { Member } from "@/types/types";
import { ToggleRight, ToggleLeft } from "lucide-react";
import { useState } from "react";



const StatusBadge = ({ member }: { member:Member }) => {
	const {updateMember} = useMembers()
	const [userStatus, setUserStatus] = useState<boolean>(member.isActive)
	const handleStatusChange = (e: React.MouseEvent<HTMLSpanElement>) => {
		e.stopPropagation()
		setUserStatus((prev) => !prev);
		member.isActive = userStatus
		updateMember(member.id, member)
	}
	return (
		<span
			className={
				"absolute right-3 top-3 flex items-center gap-1 text-xs font-medium bg-white/80 dark:bg-emerald-400/5 px-2 py-1 rounded-full shadow-sm " +
				(userStatus ? "text-green-600" : "text-red-500")
			}
			onClick={handleStatusChange}
		>
			{userStatus ? (
				<>
					<ToggleRight
						size={14}
						className="text-green-600 dark:text-gray-300/80"
					/>
					<span className="dark:text-emerald-200/80">Active</span>
				</>
			) : (
				<>
					<ToggleLeft
						size={14}
						className="text-red-500 dark:text-red-300/60"
					/>
					<span className="dark:text-red-300/80">Inactive</span>
				</>
			)}
		</span>
	);
	
};

export default StatusBadge;
