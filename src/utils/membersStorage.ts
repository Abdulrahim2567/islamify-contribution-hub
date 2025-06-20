
import type { Member } from "../components/admin/types";

const MEMBERS_KEY = "islamify_members";

/** Read all members from localStorage, or return [] if not present. */
export function readMembers(): Member[] {
  try {
    const data = localStorage.getItem(MEMBERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist an updated members array in localStorage. */
export function writeMembers(members: Member[]): void {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

/** Create a new member and add to localStorage. */
export function createMember(member: Member): void {
  const members = readMembers();
  const updatedMembers = [...members, member];
  writeMembers(updatedMembers);
}

/** Update an existing member in localStorage. */
export function updateMember(memberData: Member): void {
  const members = readMembers();
  const updatedMembers = members.map(member =>
    member.id === memberData.id ? memberData : member
  );
  writeMembers(updatedMembers);
}

/** Delete a member from localStorage. */
export function deleteMember(memberId: number): void {
  const members = readMembers();
  const updatedMembers = members.filter(member => member.id !== memberId);
  writeMembers(updatedMembers);
}
