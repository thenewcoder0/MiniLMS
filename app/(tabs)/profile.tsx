import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface User {
    _id: string;
    username: string;
    email: string;
    avatar: { url: string };
    role: string;
    isEmailVerified: boolean;
}

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const stored = await AsyncStorage.getItem('user');
            const bookmarks = await AsyncStorage.getItem('bookmarks');
            if (stored) setUser(JSON.parse(stored));
            if (bookmarks) setBookmarkCount(JSON.parse(bookmarks).length);
        } catch (error) {
            console.log('Error loading user:', error);
        }
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>👤 Profile</Text>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 0.5 }}>
                <View style={styles.profileCard}>
                    <Image
                        source={{ uri: user?.avatar?.url || 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>@{user?.username}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{user?.role}</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Ionicons name="bookmark" size={24} color="#3B82F6" />
                        <Text style={styles.statNumber}>{bookmarkCount}</Text>
                        <Text style={styles.statLabel}>Bookmarks</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                        <Text style={styles.statNumber}>
                            {user?.isEmailVerified ? 'Yes' : 'No'}
                        </Text>
                        <Text style={styles.statLabel}>Email Verified</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="person" size={24} color="#8B5CF6" />
                        <Text style={styles.statNumber}>{user?.role === 'USER' ? 'Student' : 'Admin'}</Text>
                        <Text style={styles.statLabel}>Account Type</Text>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="settings-outline" size={22} color="#6B7280" />
                        <Text style={styles.menuText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="help-circle-outline" size={22} color="#6B7280" />
                        <Text style={styles.menuText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="shield-outline" size={22} color="#6B7280" />
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { backgroundColor: 'white', padding: 16, paddingTop: 48 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    profileCard: {
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 12,
        backgroundColor: '#E5E7EB',
    },
    username: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    email: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
    badge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: { color: '#3B82F6', fontWeight: '600', fontSize: 12 },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statNumber: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
    statLabel: { fontSize: 11, color: '#6B7280', marginTop: 2 },
    menuSection: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    menuText: { flex: 1, fontSize: 15, color: '#374151' },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        margin: 16,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        marginBottom: 32,
    },
    logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});