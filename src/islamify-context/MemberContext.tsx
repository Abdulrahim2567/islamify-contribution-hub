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
}



export const MemberProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [members, setMembers] = useState<Member[]>([]);

    useEffect(() => {
        setMembers(readMembersFromStorage());
    }, []);

    const refreshMembers = () => {
        setMembers(readMembersFromStorage());
    };

    const addMember = (member: Member) => {
        addMemberToStorage(member);
        refreshMembers();
    };

    const deleteMember = (id: number) => {
        deleteMemberFromStorage(id);
        refreshMembers();
    };

    const updateMember = (id: number, updatedInfo: Partial<Member>) => {
        updateMemberInfo(id, updatedInfo);
        refreshMembers();
    };

    const setRole = (id: number, role: "admin" | "member") => {
        updateMemberRole(id, role);
        refreshMembers();
    };

    const setActiveStatus = (id: number, isActive: boolean) => {
        updateMemberActiveStatus(id, isActive);
        refreshMembers();
    };

    const setLoanEligibility = (id: number, eligible: boolean) => {
        updateMemberLoanEligibility(id, eligible);
        refreshMembers();
    };

    const clearMembers = () => {
        clearMembersFromStorage();
        refreshMembers();
    };

    const values = {
        members,
        addMember,
        deleteMember: deleteMember,
        updateMember: updateMember,
        setRole: setRole,
        setActiveStatus: setActiveStatus,
        setLoanEligibility: setLoanEligibility,
        refreshMembers: refreshMembers,
        clearMembers: clearMembers,
    }

    return (
        <MemberContext.Provider value={values}>
            {children}
        </MemberContext.Provider>
    );
};

// useMembers hook moved to a separate file: useMembers.ts
