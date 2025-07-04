//methods to read and write contributions to local storage
import { Contribution } from '../types/types';

const LOCAL_STORAGE_KEY = 'islamify_contributions';

export const saveContribution = (contribution: Contribution) => {
	const contributions = getContributions();
	contributions.push(contribution);
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contributions));
};

export const getContributions = (): Contribution[] => {
	const data = localStorage.getItem(LOCAL_STORAGE_KEY);
	return data ? JSON.parse(data) : [];
};

export const getTotalMemberContributions = (memberId: string): number => {
    const contributions = getContributions();
    return contributions
        .filter(contribution => contribution.memberId === memberId)
        .reduce((total, contribution) => total + contribution.amount, 0);
};

export const getTotalContributions = (): number => {
    const contributions = getContributions();
    return contributions.reduce((total, contribution) => total + contribution.amount, 0);
};

//add contribution
export const addContribution = (contribution: Contribution) => {
    const contributions = getContributions();
    contributions.push(contribution);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contributions));
};

//update member contribution amount and details
export const updateMemberContribution = (contributionId: string, updatedContribution: Contribution) => {
    const contributions = getContributions();
    const index = contributions.findIndex(contribution => Number(contribution._id) === Number(contributionId));
    if (index !== -1) {
        contributions[index] = updatedContribution;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contributions));
    }
};

//delete contribution
export const deleteContribution = (contributionId: string) => {
    const contributions = getContributions();
    const filtered = contributions.filter(contribution => Number(contribution._id) !== Number(contributionId));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
};

export const clearContributions = () => {
	localStorage.removeItem(LOCAL_STORAGE_KEY);
};
