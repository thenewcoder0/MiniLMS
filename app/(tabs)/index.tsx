import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Image, RefreshControl } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    instructor: string;
    price: number;
}

export default function CoursesScreen() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [filtered, setFiltered] = useState<Course[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [bookmarks, setBookmarks] = useState<number[]>([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookmarks();
        }, [])
    );

    const loadBookmarks = async () => {
        const stored = await AsyncStorage.getItem('bookmarks');
        if (stored) setBookmarks(JSON.parse(stored));
    };

    const fetchCourses = async () => {
        try {
            const [products, users] = await Promise.all([
                api.get('/api/v1/public/randomproducts?limit=20'),
                api.get('/api/v1/public/randomusers?limit=20'),
            ]);

            const courseList = products.data.data.map((product: any, index: number) => {
                const user = users.data.data[index % users.data.data.length];
                const name = user?.name ? `${user.name.first} ${user.name.last}` : 'Unknown';
                return {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    thumbnail: `https://picsum.photos/seed/${product.id}/400/200`,
                    price: product.price,
                    instructor: name,
                };
            });

            setCourses(courseList);
            setFiltered(courseList);
            await AsyncStorage.setItem('allCourses', JSON.stringify(courseList));
        } catch (error) {
            console.log('Error fetching courses:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearch(text);
        const filteredCourses = courses.filter(course =>
            course.title.toLowerCase().includes(text.toLowerCase()) ||
            course.instructor.toLowerCase().includes(text.toLowerCase())
        );
        setFiltered(filteredCourses);
    };

    const toggleBookmark = async (id: number) => {
        const updated = bookmarks.includes(id)
            ? bookmarks.filter(b => b !== id)
            : [...bookmarks, id];
        setBookmarks(updated);
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
    };

    const renderCourse = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/course-details',
                params: { course: JSON.stringify(item) }
            })}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
                <Text style={styles.instructor}>👨‍🏫 {item.instructor}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.price}>${item.price}</Text>
                    <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                        <Ionicons
                            name={bookmarks.includes(item.id) ? 'bookmark' : 'bookmark-outline'}
                            size={24}
                            color={bookmarks.includes(item.id) ? '#3B82F6' : '#9CA3AF'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📚 Courses</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search courses..."
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderCourse}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchCourses();
                    }} />
                }
                ListEmptyComponent={
                    <Text style={styles.empty}>No courses found</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: 'white', padding: 16, paddingTop: 48 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    searchInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
    },
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
    thumbnail: { width: '100%', height: 160 },
    cardContent: { padding: 16 },
    instructor: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
    description: { fontSize: 13, color: '#6B7280', marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: 16, fontWeight: 'bold', color: '#3B82F6' },
    empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 },
});