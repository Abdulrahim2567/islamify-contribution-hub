import React from "react";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import { User, Shield } from "lucide-react";
import type { Member } from "../../../types/types";

interface RoleSelectProps {
	member: Member;
	onRoleChange: (id: number, newRole: "member" | "admin") => void;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ member, onRoleChange }) => (
	<Select
		value={member.role}
		onValueChange={(newRole) =>
			onRoleChange(member.id, newRole as "member" | "admin")
		}
	>
		<SelectTrigger className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-400/5 text-blue-700 dark:text-emerald-300/80 rounded-full uppercase font-semibold tracking-widest w-[100px] flex justify-center mx-auto hover:bg-gray-100 dark:hover:bg-emerald-200/10 dark:border-emerald-200/30">
			<div className="flex items-center gap-1">
				{member.role === "admin" ? (
					<Shield size={12} />
				) : (
					<User size={12} />
				)}
				<SelectValue />
			</div>
		</SelectTrigger>
		<SelectContent>
			<SelectItem value="member">
				<div className="flex items-center gap-2">
					<User size={14} />
					Member
				</div>
			</SelectItem>
			<SelectItem value="admin">
				<div className="flex items-center gap-2">
					<Shield size={14} />
					Admin
				</div>
			</SelectItem>
		</SelectContent>
	</Select>
);

export default RoleSelect;
