import React, { useState } from "react";

import type { Member } from "../types/types";


import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

import { useMembers } from "@/hooks/useMembers";

import { useRecentActivities } from "@/hooks/useRecentActivities";
import { useIslamifySettings } from "@/hooks/useIslamifySettings";

import Members from "./admin/tabs/Members";
import NavigationBar from "./admin/TopNavigationBar/NavigationBar";
import Dashboard from "./admin/tabs/Dashboard";
import Loan from "./admin/tabs/Loan";
import Contributions from "./admin/tabs/Contributions";

interface AdminDashboardProps {
	user: Member;
	onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
	const { members } = useMembers();

	const {
		adminActivities,
		memberLoanActivities,
		memberContributionActivities,
	} = useRecentActivities();
	const { settings, updateSettings } = useIslamifySettings();
	const [activeTab, setActiveTab] = useState("dashboard");

	// For admin, find "self" as a member record, e.g., by email
	const thisAdminMember = members.find(
		(m) => m.email === user.email || m.id === user.id
	);

	return (
		<SidebarProvider>
			<div className="min-h-screen flex w-full bg-background">
				<AppSidebar
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onLogout={onLogout}
					user={thisAdminMember}
				/>
				<SidebarInset>
					{/* Top Navigation */}
					<NavigationBar
						settings={settings}
						user={thisAdminMember}
						adminActivities={adminActivities}
						memberLoanActivities={memberLoanActivities}
						memberContributionActivities={
							memberContributionActivities
						}
						updateSettings={updateSettings}
						onLogout={onLogout}
					/>

					{/* Content */}
					<div className="p-6 bg-background">
						{activeTab === "dashboard" && (
							<Dashboard
								thisAdminMember={thisAdminMember}
								members={members}
								settings={settings}
								adminActivities={adminActivities}
							/>
						)}

						{activeTab === "members" && (
							<Members
								user={thisAdminMember}
								settings={settings}
								members={members}
							/>
						)}
						{activeTab === "contributions" && (
							<Contributions thisAdminMember={thisAdminMember} />
						)}

						{activeTab === "loans" && <Loan user={thisAdminMember} />}
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};

export default AdminDashboard;
