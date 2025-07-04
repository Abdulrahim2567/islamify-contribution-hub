import React, { useEffect, useState } from "react";
import { Contribution } from "@/types/types";
import {
	getContributions,
	addContribution as addContributionToStorage,
	updateMemberContribution as updateContributionInStorage,
	deleteContribution as deleteContributionFromStorage,
	getTotalContributions as getTotalContributionsFromStorage,
	getTotalMemberContributions as getTotalByMemberFromStorage,
	clearContributions as clearContributionsFromStorage,
} from "@/utils/contributionsStorage";

import { ContributionContext } from "@/hooks/useContributions";

export interface ContributionContextProps {
	contributions: Contribution[];
	addMemberContribution: (contribution: Contribution) => void;
	updateMemberContribution: (id: string, updated: Contribution) => void;
	deleteMemberContribution: (id: string) => void;
	deleteAllMemberContributions: (memberId: string) => boolean
	getTotalContributionsByMember: (memberId: string) => number;
	getTotalAllContributions: () => number;
	refresh: () => void;
	deleteAllContributions: () => void;
}

export const ContributionProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [contributions, setContributions] = useState<Contribution[]>([]);

	useEffect(() => {
		setContributions(getContributions());
	}, []);

	const refresh = () => {
		setContributions(getContributions());
	};

	const addMemberContribution = (contribution: Contribution) => {
		const updated = [...contributions, contribution];
		setContributions(updated);
		addContributionToStorage(contribution);
	};

	const updateMemberContribution = (id: string, updated: Contribution) => {
		const updatedList = contributions.map((c) =>
			c._id === id ? updated : c
		);
		setContributions(updatedList);
		updateContributionInStorage(id, updated);
	};

	const deleteMemberContribution = (id: string) => {
		const updated = contributions.filter((c) => c._id !== id);
		setContributions(updated);
		deleteContributionFromStorage(id);
	};

	const getTotalContributionsByMember = (memberId: string): number => {
		return contributions
			.filter((c) => c.memberId === memberId)
			.reduce((total, c) => total + c.amount, 0);
	};

	const getTotalAllContributions = (): number => {
		return contributions.reduce((total, c) => total + c.amount, 0);
	};

	const deleteAllContributions = () => {
		setContributions([]);
		clearContributionsFromStorage();
	};
	const deleteAllMemberContributions = (memberId: string): boolean => {
		const filtered = contributions.filter((c) => c.memberId !== memberId);
		const wasDeleted = filtered.length !== contributions.length;

		if (wasDeleted) {
			setContributions(filtered);
			// Overwrite localStorage with the filtered list
			localStorage.setItem(
				"islamify_contributions",
				JSON.stringify(filtered)
			);
		}

		return wasDeleted;
	};
	

	const values: ContributionContextProps = {
		contributions,
		addMemberContribution,
		updateMemberContribution,
		deleteMemberContribution,
		getTotalContributionsByMember,
		getTotalAllContributions,
		refresh,
		deleteAllContributions,
		deleteAllMemberContributions
	};

	return (
		<ContributionContext.Provider value={values}>
			{children}
		</ContributionContext.Provider>
	);
};
