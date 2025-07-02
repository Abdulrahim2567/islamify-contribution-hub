import React, { useEffect, useState } from "react";
import { Member } from "../types/types";
import {
	readMembersFromStorage,
	writeMembersToStorage,
	addMemberToStorage,
	deleteMemberFromStorage,
	updateMemberInfo,
	updateMemberRole,
	updateMemberActiveStatus,
	updateMemberLoanEligibility,
	clearMembersFromStorage,
} from "@/utils/membersStorage";
import { MemberContext } from "@/hooks/useMembers";
import { getNowString } from "@/utils/calculations";

const DEMO_ADMIN: Member = {
	id: 1,
	email: "admin@islamify.org",
	password: "admin123",
	role: "admin",
	name: "Admin User",
	phone: "677941823",
	needsPasswordChange: false,
	registrationFee: 0,
	totalContributions: 0,
	isActive: true,
	loanEligible: false,
	canApplyForLoan: false,
	joinDate: getNowString(),
};

export interface MemberContextProps {
	members: Member[];
	addMember: (member: Member) => void;
	deleteMember: (id: number) => void;
	updateMember: (id: number, updatedInfo: Partial<Member>) => void;
	setRole: (id: number, role: "admin" | "member") => void;
	setActiveStatus: (id: number, isActive: boolean) => void;
	setLoanEligibility: (id: number, eligible: boolean) => void;
	refreshMembers: () => void;
	clearMembers: () => void;

	// Derived utilities (optional)
	getMemberById: (id: number) => Member | undefined;
	getAdmins: () => Member[];
	getActiveMembers: () => Member[];
	getInactiveMembers: () => Member[];
}

export const MemberProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [members, setMembers] = useState<Member[]>([]);

	useEffect(() => {
		const allMembers = readMembersFromStorage()
		if(allMembers.length < 1){
			addMember(DEMO_ADMIN)
			allMembers.push(DEMO_ADMIN)
		}
		setMembers(allMembers);
	}, []);

	const refreshMembers = () => {
		const allMembers = readMembersFromStorage();
		if (allMembers.length < 1) {
			addMember(DEMO_ADMIN);
			allMembers.push(DEMO_ADMIN);
		}
		setMembers(allMembers);
	};

	const addMember = (member: Member) => {
		const updated = [...members, member];
		setMembers(updated);
		writeMembersToStorage(updated);
	};

	const deleteMember = (id: number) => {
		const updated = members.filter((m) => m.id !== id);
		setMembers(updated);
		writeMembersToStorage(updated);
	};

	const updateMember = (id: number, updatedInfo: Partial<Member>) => {
		const updated = members.map((m) => {
			if (m.id !== id) return m;

			// Special merge for readNotifications to avoid overwriting
			if (
				Array.isArray(updatedInfo.readNotifications) &&
				Array.isArray(m.readNotifications)
			) {
				const mergedSet = new Set([
					...m.readNotifications,
					...updatedInfo.readNotifications,
				]);

				return {
					...m,
					...updatedInfo,
					readNotifications: Array.from(mergedSet),
				};
			}

			return { ...m, ...updatedInfo };
		});

		setMembers(updated);
		writeMembersToStorage(updated);
	};
	

	const setRole = (id: number, role: "admin" | "member") => {
		updateMember(id, { role });
	};

	const setActiveStatus = (id: number, isActive: boolean) => {
		updateMember(id, { isActive });
	};

	const setLoanEligibility = (id: number, eligible: boolean) => {
		updateMember(id, { loanEligible: eligible });
	};

	const clearMembers = () => {
		setMembers([]);
		clearMembersFromStorage();
	};

	// Optional utility methods
	const getMemberById = (id: number) => members.find((m) => m.id === id);
	const getAdmins = () => members.filter((m) => m.role === "admin");
	const getActiveMembers = () => members.filter((m) => m.isActive);
	const getInactiveMembers = () => members.filter((m) => !m.isActive);

	const values: MemberContextProps = {
		members,
		addMember,
		deleteMember,
		updateMember,
		setRole,
		setActiveStatus,
		setLoanEligibility,
		refreshMembers,
		clearMembers,
		getMemberById,
		getAdmins,
		getActiveMembers,
		getInactiveMembers,
	};

	return (
		<MemberContext.Provider value={values}>
			{children}
		</MemberContext.Provider>
	);
};
