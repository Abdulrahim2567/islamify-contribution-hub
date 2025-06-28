import { createContext, useContext } from "react";
import { RecentActivitiesContextProps } from "@/islamify-context/RecentActivitiesContext";

export const RecentActivitiesContext = createContext<RecentActivitiesContextProps | undefined>(undefined);

export const useRecentActivities = (): RecentActivitiesContextProps => {
	const context = useContext(RecentActivitiesContext);
	if (!context) {
		throw new Error("useRecentActivities must be used within a RecentActivitiesProvider");
	}
	return context;
};
