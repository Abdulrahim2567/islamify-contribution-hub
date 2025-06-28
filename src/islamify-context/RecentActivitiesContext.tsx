import React, { useEffect, useState } from "react";
import {
	AdminActivityLog,
	ContributionRecordActivity,
	MemberLoanActivity,
} from "@/types/types";
import {
	getAdminRecentActivities,
	getMemberContributionActivities,
	getMemberEditContributionActivities,
	getMemberLoanActivities,
	saveAdminRecentActivity,
	saveMemberContributionActivity,
	saveMemberEditContributionActivity,
	saveMemberLoanActivity,
	clearAdminRecentActivities,
	clearMemberContributionActivities,
	clearMemberEditContributionActivities,
	clearMemberLoanActivities,
	clearAllRecentActivities,
} from "@/utils/recentActivitiesStorage";

import { RecentActivitiesContext } from "@/hooks/useRecentActivities";

export interface RecentActivitiesContextProps {
	adminActivities: AdminActivityLog[];
	memberContributionActivities: ContributionRecordActivity[];
	memberLoanActivities: MemberLoanActivity[];
	memberEditContributionActivities: AdminActivityLog[];

	saveAdminActivity: (activity: AdminActivityLog) => void;
	saveContributionActivity: (activity: ContributionRecordActivity) => void;
	saveEditContributionActivity: (activity: AdminActivityLog) => void;
	saveLoanActivity: (activity: MemberLoanActivity) => void;

	clearAdminActivities: () => void;
	clearContributionActivities: () => void;
	clearEditContributionActivities: () => void;
	clearLoanActivities: () => void;
	clearAllActivities: () => void;

	refresh: () => void;
	// ✅ new helper methods using state
	getAllContributionsActivitiesForMember: (
		memberId: number
	) => ContributionRecordActivity[];
	getMemberLoanActivitiesByMember: (memberId: number) => MemberLoanActivity[];
}

export const RecentActivitiesProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [adminActivities, setAdminActivities] = useState<AdminActivityLog[]>(
		[]
	);
	const [memberContributionActivities, setContributionActivities] = useState<
		ContributionRecordActivity[]
	>([]);
	const [memberLoanActivities, setLoanActivities] = useState<
		MemberLoanActivity[]
	>([]);
	const [memberEditContributionActivities, setEditContributionActivities] =
		useState<AdminActivityLog[]>([]);

	const refresh = () => {
		setAdminActivities(getAdminRecentActivities());
		setContributionActivities(getMemberContributionActivities());
		setLoanActivities(getMemberLoanActivities());
		setEditContributionActivities(getMemberEditContributionActivities());
	};

	useEffect(() => {
		refresh();
	}, []);

	const saveAdminActivity = (activity: AdminActivityLog) => {
		saveAdminRecentActivity(activity);
		refresh();
	};

	const saveContributionActivity = (activity: ContributionRecordActivity) => {
		saveMemberContributionActivity(activity);
		refresh();
	};

	const saveEditContributionActivity = (activity: AdminActivityLog) => {
		saveMemberEditContributionActivity(activity);
		refresh();
	};

	const saveLoanActivity = (activity: MemberLoanActivity) => {
		saveMemberLoanActivity(activity);
		refresh();
	};

	const clearAdminActivities = () => {
		clearAdminRecentActivities();
		refresh();
	};

	const clearContributionActivities = () => {
		clearMemberContributionActivities();
		refresh();
	};

	const clearEditContributionActivities = () => {
		clearMemberEditContributionActivities();
		refresh();
	};

	const clearLoanActivities = () => {
		clearMemberLoanActivities();
		refresh();
	};

	const clearAllActivities = () => {
		clearAllRecentActivities();
		refresh();
	};

	const getAllContributionsActivitiesForMember = (memberId: number) =>
		memberContributionActivities.filter((a) => a.memberId === memberId);

	const getMemberLoanActivitiesByMember = (memberId) =>
		memberLoanActivities.filter((a) => a.memberId === memberId);

	const values: RecentActivitiesContextProps = {
		adminActivities,
		memberContributionActivities,
		memberLoanActivities,
		memberEditContributionActivities,
		saveAdminActivity,
		saveContributionActivity,
		saveEditContributionActivity,
		saveLoanActivity,
		getAllContributionsActivitiesForMember,
		getMemberLoanActivitiesByMember,
		clearAdminActivities,
		clearContributionActivities,
		clearEditContributionActivities,
		clearLoanActivities,
		clearAllActivities,
		refresh,
	};

	return (
		<RecentActivitiesContext.Provider value={values}>
			{children}
		</RecentActivitiesContext.Provider>
	);
};
