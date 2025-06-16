
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  category?: 'loan' | 'contribution' | 'general';
}

export const sendNotification = (userId: number, notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  try {
    const NOTIFICATIONS_KEY = `islamify_notifications_${userId}`;
    const existingNotifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    const updatedNotifications = [newNotification, ...existingNotifications];
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error saving notification:', error);
  }
};

export const getNotifications = (userId: number): Notification[] => {
  try {
    const NOTIFICATIONS_KEY = `islamify_notifications_${userId}`;
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

export const markNotificationsAsRead = (userId: number, category?: string) => {
  try {
    const NOTIFICATIONS_KEY = `islamify_notifications_${userId}`;
    const notifications = getNotifications(userId);
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: category ? (notification.category === category ? true : notification.read) : true
    }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};

export const getUnreadNotificationCount = (userId: number, category?: string): number => {
  const notifications = getNotifications(userId);
  return notifications.filter(n => 
    !n.read && (category ? n.category === category : true)
  ).length;
};
