const NOTIFICATIONS_KEY = `islamify_notifications`;
import { IslamifyMemberNotification } from "@/types/types";

export const saveMemberNotification = (notification: IslamifyMemberNotification) => {
    const notifications = getMemberNotifications();
    notifications.push(notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

export const getMemberNotifications = (): IslamifyMemberNotification[] => {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

export const getMemberNotificationById = (id: number): IslamifyMemberNotification | null => {
    const notifications = getMemberNotifications();
    return notifications.find((notification) => notification.id === id) || null;
};

export const updateMemberNotification = (id: number, updatedNotification: IslamifyMemberNotification) => {
    const notifications = getMemberNotifications();
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index !== -1) {
        notifications[index] = updatedNotification;
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
};

export const deleteMemberNotification = (id: number) => {
    const notifications = getMemberNotifications();
    const filtered = notifications.filter((notification) => notification.id !== id);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
};

export const clearMemberNotifications = () => {
    localStorage.removeItem(NOTIFICATIONS_KEY);
};