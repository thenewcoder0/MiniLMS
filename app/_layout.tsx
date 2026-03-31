import { Stack } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { requestNotificationPermission, scheduleReminderNotification } from '../utils/notifications';
import { storage } from '@/utils/api';

export default function RootLayout() {
    useEffect(() => {
        checkAuth();
        setupNotifications();
    }, []);

    const setupNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            await scheduleReminderNotification();
        }
    };

    const checkAuth = async () => {
        try {
            const token = await storage.getToken() || await AsyncStorage.getItem('token');
            if (token) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/login');
            }
        } catch (error) {
            router.replace('/(auth)/login');
        }
    };

    return (
        <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="course-details"
                options={{
                    title: 'Course Details',
                    headerBackTitle: 'Back',
                    headerTintColor: '#3B82F6',
                }}
            />
            <Stack.Screen
                name="webview"
                options={{
                    title: 'Course Content',
                    headerTintColor: '#3B82F6',
                }}
            />
        </Stack>
    );
}