
import type { ContributionRecord } from "../components/admin/types";

const CONTRIBUTIONS_KEY = "islamify_contributions";

/** Read all contributions from localStorage, or return [] if not present. */
export function readContributions(): ContributionRecord[] {
  try {
    const data = localStorage.getItem(CONTRIBUTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist an updated contributions array in localStorage. */
export function writeContributions(contributions: ContributionRecord[]): void {
  localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions));
}

/** Create a new contribution and add to localStorage. */
export function createContribution(contribution: ContributionRecord): void {
  const contributions = readContributions();
  const updatedContributions = [...contributions, contribution];
  writeContributions(updatedContributions);
}

/** Update an existing contribution in localStorage. */
export function updateContribution(contributionData: ContributionRecord): void {
  const contributions = readContributions();
  const updatedContributions = contributions.map(contribution =>
    contribution.id === contributionData.id ? contributionData : contribution
  );
  writeContributions(updatedContributions);
}

/** Delete a contribution from localStorage. */
export function deleteContribution(contributionId: number): void {
  const contributions = readContributions();
  const updatedContributions = contributions.filter(contribution => contribution.id !== contributionId);
  writeContributions(updatedContributions);
}
