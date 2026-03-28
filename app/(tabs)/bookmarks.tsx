import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    price: number;
}

export default function BookmarksScreen() {
    const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadBookmarkedCourses();
        }, [])
    );

    const loadBookmarkedCourses = async () => {
        try {
            const stored = await AsyncStorage.getItem('bookmarks');
            const allCourses = await AsyncStorage.getItem('allCourses');

            if (stored && allCourses) {
                const bookmarkIds: number[] = JSON.parse(stored);
                const courses: Course[] = JSON.parse(allCourses);
                const filtered = courses.filter(c => bookmarkIds.includes(c.id));
                setBookmarkedCourses(filtered);
            }
        } catch (error) {
            console.log('Error loading bookmarks:', error);
        }
    };

    const removeBookmark = async (id: number) => {
        const stored = await AsyncStorage.getItem('bookmarks');
        const bookmarkIds: number[] = stored ? JSON.parse(stored) : [];
        const updated = bookmarkIds.filter(b => b !== id);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
        setBookmarkedCourses(prev => prev.filter(c => c.id !== id));
    };

    if (bookmarkedCourses.length === 0) {
        return (
            <View style={styles.centered}>
                <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
                <Text style={styles.emptySubtitle}>Bookmark courses to see them here</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🔖 Bookmarks</Text>
            </View>
            <FlatList
                data={bookmarkedCourses}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                        <View style={styles.cardContent}>
                            <Text style={styles.instructor}>👨‍🏫 {item.instructor}</Text>
                            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                            <View style={styles.cardFooter}>
                                <Text style={styles.price}>${item.price}</Text>
                                <TouchableOpacity onPress={() => removeBookmark(item.id)}>
                                    <Ionicons name="bookmark" size={24} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    header: { backgroundColor: 'white', padding: 16, paddingTop: 48 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    list: { padding: 16, gap: 16 },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnail: { width: '100%', height: 140 },
    cardContent: { padding: 16 },
    instructor: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
    emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#6B7280', marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: '#9CA3AF' },
});