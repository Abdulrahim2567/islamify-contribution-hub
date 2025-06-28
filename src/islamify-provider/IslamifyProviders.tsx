import React from "react";
import { MemberProvider } from "@/islamify-context/MemberContext";
import { ContributionProvider } from "@/islamify-context/ContributionContext";
import { LoanRequestsProvider } from "@/islamify-context/LoanRequestsContext";
import { RecentActivitiesProvider } from "@/islamify-context/RecentActivitiesContext";
import { IslamifySettingsProvider } from "@/islamify-context/IslamifySettingsContext";

interface Props {
	children: React.ReactNode;
}

const IslamifyProviders = ({ children }: Props): JSX.Element => {
	return (
		<MemberProvider>
			<ContributionProvider>
				<LoanRequestsProvider>
					<RecentActivitiesProvider>
						<IslamifySettingsProvider>
							{children}
						</IslamifySettingsProvider>
					</RecentActivitiesProvider>
				</LoanRequestsProvider>
			</ContributionProvider>
		</MemberProvider>
	);
};

export default IslamifyProviders;
