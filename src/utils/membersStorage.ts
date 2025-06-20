
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
