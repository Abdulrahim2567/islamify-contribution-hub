import { SettingsSidebar } from "@/components/SettingsSidebar";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-dropdown/UserDropdown";
import { useMembers } from "@/hooks/useMembers";
import {
	AdminActivityLog,
	AppSettings,
	ContributionRecordActivity,
	Member,
	MemberLoanActivity,
} from "@/types/types";
import { Settings2Icon, User } from "lucide-react";
import React, { useState } from "react";

interface NavigationBarProps {
	settings: AppSettings;
	user: Member;
	adminActivities: AdminActivityLog[];
	memberLoanActivities: MemberLoanActivity[];
	memberContributionActivities: ContributionRecordActivity[];
	updateSettings: (newSettings: AppSettings) => void;
	onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
	settings,
	user,
	adminActivities,
	memberContributionActivities,
	memberLoanActivities,
	updateSettings,
	onLogout,
}) => {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const { updateMember } = useMembers();
	return (
		<>
			{/* Header */}
			<div className="sticky top-0 z-50 bg-background/50 border-b border-gray-200 dark:border-gray-900 px-6 py-4 backdrop-blur">
				<div className="flex items-center justify-between">
					{/* LEFT SIDE: Logo + Welcome */}
					<div className="flex items-center space-x-4">
						<SidebarTrigger />
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
								<User className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
									{settings.associationName}
								</h1>
								<p className="text-sm text-gray-600 dark:text-gray-300/80">
									Welcome back, {User.name}
								</p>
							</div>
						</div>
					</div>

					{/* RIGHT SIDE: User Menu */}
					<div className="ml-auto relative flex">
						{user && (
							<>
								<UserDropdown user={user} onLogout={onLogout} />
								<NotificationDropdown
									notifications={adminActivities}
									itemsPerPage={10}
									user={user}
									memberLoans={memberLoanActivities}
									contributions={memberContributionActivities}
									onUpdateReadNotifications={updateMember}
								/>
							</>
						)}
						<button
							onClick={() => setSettingsOpen(true)}
							className="ml-2 p-2 text-gray-500 hover:text-gray-700"
						>
							<Settings2Icon />
						</button>
					</div>
				</div>
			</div>
			<SettingsSidebar
				open={settingsOpen}
				onOpenChange={setSettingsOpen}
				settings={settings}
				user={user}
				updateSettings={updateSettings}
			/>
		</>
	);
};

export default NavigationBar;
