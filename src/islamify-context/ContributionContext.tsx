import React, { useEffect, useState } from "react";
import { Contribution } from "@/types/types";
import {
	getContributions,
	addContribution,
	updateMemberContribution,
	deleteContribution,
	getTotalContributions,
	getTotalMemberContributions,
	clearContributions,
} from "@/utils/contributionsStorage";

import { ContributionContext } from "@/hooks/useContributions";

export interface ContributionContextProps {
	contributions: Contribution[];
	addMemberContribution: (contribution: Contribution) => void;
	updateMemberContribution: (id: number, updated: Contribution) => void;
	deleteMemberContribution: (id: number) => void;
	getTotalContributionsByMember: (memberId: number) => number;
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

	const add = (contribution: Contribution) => {
		addContribution(contribution);
		refresh();
	};

	const update = (id: number, updated: Contribution) => {
		updateMemberContribution(id, updated);
		refresh();
	};

	const remove = (id: number) => {
		deleteContribution(id);
		refresh();
	};

	const getTotalByMember = (memberId: number): number => {
		return getTotalMemberContributions(memberId);
	};

	const getTotalAll = (): number => {
		return getTotalContributions();
	};

	const clear = () => {
		clearContributions();
		refresh();
	};

	const values: ContributionContextProps = {
		contributions,
		addMemberContribution: add,
		updateMemberContribution: update,
		deleteMemberContribution: remove,
		getTotalContributionsByMember: getTotalByMember,
		getTotalAllContributions: getTotalAll,
		refresh,
		deleteAllContributions: clear,
	};

	return (
		<ContributionContext.Provider value={values}>
			{children}
		</ContributionContext.Provider>
	);
};
