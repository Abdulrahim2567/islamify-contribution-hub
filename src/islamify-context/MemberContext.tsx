import React, { useEffect, useState } from "react";
import { Member } from "../types/types";
import { MemberContext } from "@/hooks/useMembers";
import {
	readMembersFromStorage,
	writeMembersToStorage,
	clearMembersFromStorage,
} from "@/utils/membersStorage";

const BASE_URL = "http://localhost:9000";
const API_BASE = BASE_URL.concat("/api/v1/member");

const DEMO_ADMIN: Member = {
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
};

export interface MemberContextProps {
	members: Member[];
	addMember: (member: Member) => Promise<Member>;
	deleteMember: (id: string) => Promise<boolean>;
	updateMember: (
		id: string,
		updatedInfo: Partial<Member>
	) => Promise<string>;
	refreshMembers: () => Promise<void>;
	clearMembers: () => void;

	getMemberById: (id: string) => Member | undefined;
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
		refreshMembers();
	}, []);

	const refreshMembers = async () => {
		try {
			const res = await fetch(API_BASE, {
				credentials: "include",
			});
			if (!res.ok) throw new Error("Failed to fetch members");
			const data: Member[] = await res.json();
			setMembers(data);
			writeMembersToStorage(data);
		} catch (err) {
			console.warn("Falling back to localStorage due to error:", err);
			const local = readMembersFromStorage();
			if (local.length === 0) {
				local.push(DEMO_ADMIN);
				writeMembersToStorage(local);
			}
			setMembers(local);
		}
	};

	const addMember = async (member: Member): Promise<Member> => {
		const res = await fetch(API_BASE, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(member),
			credentials: "include",
		});

		if (!res.ok) throw new Error("Failed to add member");
		const newMember = await res.json();
		await refreshMembers();
		return newMember;
	};

	const deleteMember = async (id: string): Promise<boolean> => {
		const res = await fetch(`${API_BASE}/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		await refreshMembers();
		return res.ok;
	};

	const updateMember = async (
		id: string,
		updatedInfo: Partial<Member>
	): Promise<"success" | "deleted" | "error"> => {
		const { _id, createdAt, updatedAt, ...safeUpdates } = updatedInfo;

		try {
			const res = await fetch(`${API_BASE}/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(safeUpdates),
				credentials: "include",
			});

			if (res.status === 401 || res.status === 404) {
				return "deleted"; // User deleted or token invalid
			}

			if (res.ok) {
				await refreshMembers();
				return "success";
			}

			console.error("Failed to update member:", await res.text());
			return "error";
		} catch (err) {
			console.error("Error updating member:", err);
			return "error";
		}
	};
	
	

	const clearMembers = () => {
		setMembers([]);
		clearMembersFromStorage();
	};

	const getMemberById = (id: string) => members.find((m) => m._id === id);
	const getAdmins = () => members.filter((m) => m.role === "admin");
	const getActiveMembers = () => members.filter((m) => m.isActive);
	const getInactiveMembers = () => members.filter((m) => !m.isActive);

	const values: MemberContextProps = {
		members,
		addMember,
		deleteMember,
		updateMember,
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
