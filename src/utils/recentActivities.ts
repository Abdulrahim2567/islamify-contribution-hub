import { AdminActivityLog, ContributionRecordActivity, MemberLoanActivity } from "@/types/types";

const MEMBER_CONTRIBUTION_ACTIVITY_KEY = "islamify_recent_activities_contributions";
const MEMBER_LOAN_ACTIVITY_KEY = "islamify_recent_activities_loan";
const MEMBER_EDIT_CONTRIBUTION_KEY = "islamify_recent_activities_edit_contribution";
const ADMIN_ACTIVITY_KEY = "islamify_admin_recent_activities";

// Member contribution activities

export const saveMemberContributionActivity = (activity: ContributionRecordActivity) => {
    const activities = getMemberContributionActivities();
    activities.push(activity);
    localStorage.setItem(MEMBER_CONTRIBUTION_ACTIVITY_KEY, JSON.stringify(activities));
};

export const getMemberContributionActivities = (): ContributionRecordActivity[] => {
    const data = localStorage.getItem(MEMBER_CONTRIBUTION_ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
};

export const clearMemberContributionActivities = () => {
    localStorage.removeItem(MEMBER_CONTRIBUTION_ACTIVITY_KEY);
};

export const getAllContributionsActivitiesForMember = (memberId: number): ContributionRecordActivity[] => {
    const activities = getMemberContributionActivities();
    return activities.filter(activity => activity.memberId === memberId);
};

// Admin activities

export const saveAdminRecentActivity = (activity: AdminActivityLog) => {
    const activities = getAdminRecentActivities();
    activities.push(activity);
    localStorage.setItem(ADMIN_ACTIVITY_KEY, JSON.stringify(activities));
};

export const getAdminRecentActivities = (): AdminActivityLog[] => {
    const data = localStorage.getItem(ADMIN_ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
};



export const clearAdminRecentActivities = () => {
    localStorage.removeItem(ADMIN_ACTIVITY_KEY);
};


export const saveMemberEditContributionActivity = (activity: AdminActivityLog) => {
    const activities = getMemberEditContributionActivities();
    activities.push(activity);
    localStorage.setItem(MEMBER_EDIT_CONTRIBUTION_KEY, JSON.stringify(activities));
};

export const getMemberEditContributionActivities = (): AdminActivityLog[] => {
    const data = localStorage.getItem(MEMBER_EDIT_CONTRIBUTION_KEY);
    return data ? JSON.parse(data) : [];
};

export const clearMemberEditContributionActivities = () => {
    localStorage.removeItem(MEMBER_EDIT_CONTRIBUTION_KEY);
};

export const saveMemberLoanActivity = (activity: MemberLoanActivity) => {
    const activities = getMemberLoanActivities();
    activities.push(activity);
    localStorage.setItem(MEMBER_LOAN_ACTIVITY_KEY, JSON.stringify(activities));
}

export const getMemberLoanActivities = (): MemberLoanActivity[] => {
    const data = localStorage.getItem(MEMBER_LOAN_ACTIVITY_KEY);
    return data ? JSON.parse(data) : [];
};

export const getMemberLoanActivitiesByMember = (memberId: number): MemberLoanActivity[] => {
	const allActivities = getMemberLoanActivities()
    return allActivities.filter(activity => activity.memberId === memberId);
}


export const clearMemberLoanActivities = () => {
    localStorage.removeItem(MEMBER_LOAN_ACTIVITY_KEY);
};

export const clearAllRecentActivities = () => {
    clearMemberContributionActivities();
    clearAdminRecentActivities();
    clearMemberEditContributionActivities();
    clearMemberLoanActivities();
};