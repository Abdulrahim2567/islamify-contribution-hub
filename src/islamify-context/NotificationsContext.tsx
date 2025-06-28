import React, { useEffect, useState } from "react";
import { IslamifyMemberNotification } from "@/types/types";
import {
	getMemberNotifications,
	saveMemberNotification,
	updateMemberNotification,
	deleteMemberNotification,
	getMemberNotificationById,
	clearMemberNotifications,
} from "@/utils/notificationsStorage";
import { NotificationsContext } from "@/hooks/useNotifications";

export interface NotificationsContextProps {
	notifications: IslamifyMemberNotification[];
	addNotification: (notification: IslamifyMemberNotification) => void;
	updateNotification: (
		id: number,
		updated: IslamifyMemberNotification
	) => void;
	deleteNotification: (id: number) => void;
	getNotificationById: (id: number) => IslamifyMemberNotification | null;
	clearNotifications: () => void;
	refreshNotifications: () => void;
}

export const NotificationsProvider = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => {
	const [notifications, setNotifications] = useState<
		IslamifyMemberNotification[]
	>([]);

	useEffect(() => {
		setNotifications(getMemberNotifications());
	}, []);

	const refreshNotifications = () => {
		setNotifications(getMemberNotifications());
	};

	const addNotification = (notification: IslamifyMemberNotification) => {
		saveMemberNotification(notification);
		refreshNotifications();
	};

	const updateNotification = (
		id: number,
		updated: IslamifyMemberNotification
	) => {
		updateMemberNotification(id, updated);
		refreshNotifications();
	};

	const deleteNotification = (id: number) => {
		deleteMemberNotification(id);
		refreshNotifications();
	};

	const clearNotifications = () => {
		clearMemberNotifications();
		refreshNotifications();
	};

	const getNotificationById = (
		id: number
	): IslamifyMemberNotification | null => {
		return notifications.find((n) => n.id === id) || null;
	};

	const value: NotificationsContextProps = {
		notifications,
		addNotification,
		updateNotification,
		deleteNotification,
		getNotificationById,
		clearNotifications,
		refreshNotifications,
	};

	return (
		<NotificationsContext.Provider value={value}>
			{children}
		</NotificationsContext.Provider>
	);
};
