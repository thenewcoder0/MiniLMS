import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export async function requestNotificationPermission() {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    } catch (error) {
        return false;
    }
}

export async function scheduleBookmarkNotification(count: number) {
    try {
        if (count >= 5) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: '🔖 Bookmark Milestone!',
                    body: `You've bookmarked ${count} courses! Ready to start learning?`,
                },
                trigger: null,
            });
        }
    } catch (error) {
        console.log('Notification error:', error);
    }
}

export async function scheduleReminderNotification() {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
            content: {
                title: '📚 Miss Learning?',
                body: "You haven't opened MiniLMS in a while. Continue where you left off!",
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 60 * 60 * 24,
                repeats: false,
            },
        });
    } catch (error) {
        console.log('Reminder notification error:', error);
    }
}

export async function cancelReminderNotification() {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
        console.log('Cancel notification error:', error);
    }
}