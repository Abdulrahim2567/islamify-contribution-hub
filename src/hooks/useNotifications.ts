import { createContext, useContext } from "react";
import { NotificationsContextProps } from "@/islamify-context/NotificationsContext";

export const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = (): NotificationsContextProps => {
	const context = useContext(NotificationsContext);
	if (!context) {
		throw new Error("useNotifications must be used within a NotificationsProvider");
	}
	return context;
};
