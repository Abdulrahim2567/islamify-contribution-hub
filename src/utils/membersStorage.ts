
import type { Member } from "../types/types";

const MEMBERS_KEY = "islamify_members";

/** Read all members from localStorage, or return [] if not present. */
export function readMembersFromStorage(): Member[] {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Get a member by their ID from localStorage. */
export function getMemberById(memberId: string): Member | undefined {
  const members = readMembersFromStorage();
  return members.find(m => m._id === memberId);
}


/** Persist an updated members array in localStorage. */
export function writeMembersToStorage(members: Member[]): void {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function addMemberToStorage(member: Member): void {
  const members = readMembersFromStorage();
  // Check if member already exists by email
  const exists = members.some(m => m.email === member.email);
  if (!exists) {
    members.push(member);
    writeMembersToStorage(members);
  }
}

//**Remove a member from localStorage by email. */
export function deleteMemberFromStorage(memberId: string): void {
  const members = readMembersFromStorage();
  const updatedMembers = members.filter(m => m._id !== memberId);
  writeMembersToStorage(updatedMembers);
}

/** Update a member's loan eligibility in localStorage. */
export function updateMemberLoanEligibility(memberId: string, eligible: boolean): void {
  const members = readMembersFromStorage();
  const updatedMembers = members.map(m => 
    m._id === memberId ? { ...m, loanEligible: eligible } : m
  );
  writeMembersToStorage(updatedMembers);
}


/** Update a member's role in localStorage. */
export function updateMemberRole(memberId: string, newRole: "admin" | "member"): void {
  const members = readMembersFromStorage();
  const updatedMembers = members.map(m => 
    m._id === memberId ? { ...m, role: newRole } : m
  );
  writeMembersToStorage(updatedMembers);
}

//updateMemberActiveStatus
/** Update a member's active status in localStorage. */
export function updateMemberActiveStatus(memberId: string, isActive: boolean): void {
  const members = readMembersFromStorage();
  const updatedMembers = members.map(m => 
    m._id === memberId ? { ...m, isActive } : m
  );
  writeMembersToStorage(updatedMembers);
}

//updatememberInfo
/** Update a member's information in localStorage. */
export function updateMemberInfo(memberId: string, updatedInfo: Partial<Member>): void {
  const members = readMembersFromStorage();
  const updatedMembers = members.map(m => 
    m._id === memberId ? { ...m, ...updatedInfo } : m
  );
  writeMembersToStorage(updatedMembers);
}

/** Clear all members from localStorage. */
export function clearMembersFromStorage(): void {
  localStorage.removeItem(MEMBERS_KEY);
}


