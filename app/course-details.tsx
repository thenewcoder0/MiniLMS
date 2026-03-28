import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CourseDetailsScreen() {
    const { course } = useLocalSearchParams();
    const courseData = JSON.parse(course as string);
    const [bookmarked, setBookmarked] = useState(false);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        checkBookmark();
        checkEnrolled();
    }, []);

    const checkBookmark = async () => {
        const stored = await AsyncStorage.getItem('bookmarks');
        if (stored) {
            const bookmarks: number[] = JSON.parse(stored);
            setBookmarked(bookmarks.includes(courseData.id));
        }
    };

    const checkEnrolled = async () => {
        const stored = await AsyncStorage.getItem('enrolled');
        if (stored) {
            const enrolledList: number[] = JSON.parse(stored);
            setEnrolled(enrolledList.includes(courseData.id));
        }
    };

    const toggleBookmark = async () => {
        const stored = await AsyncStorage.getItem('bookmarks');
        const bookmarks: number[] = stored ? JSON.parse(stored) : [];
        const updated = bookmarked
            ? bookmarks.filter(b => b !== courseData.id)
            : [...bookmarks, courseData.id];
        await AsyncStorage.setItem('bookmarks', JSON.stringify(updated));
        setBookmarked(!bookmarked);
    };

    const handleEnroll = async () => {
        if (enrolled) {
            router.push({
                pathname: '/webview',
                params: { course: JSON.stringify(courseData) }
            });
            return;
        }
        const stored = await AsyncStorage.getItem('enrolled');
        const enrolledList: number[] = stored ? JSON.parse(stored) : [];
        enrolledList.push(courseData.id);
        await AsyncStorage.setItem('enrolled', JSON.stringify(enrolledList));
        setEnrolled(true);
        Alert.alert('🎉 Enrolled!', `You have successfully enrolled in ${courseData.title}`, [
            {
                text: 'Start Learning',
                onPress: () => router.push({
                    pathname: '/webview',
                    params: { course: JSON.stringify(courseData) }
                })
            },
            { text: 'Later', style: 'cancel' }
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={{ uri: courseData.thumbnail }} style={styles.thumbnail} />

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{courseData.title}</Text>
                        <TouchableOpacity onPress={toggleBookmark}>
                            <Ionicons
                                name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                                size={24}
                                color={bookmarked ? '#3B82F6' : '#9CA3AF'}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.instructorRow}>
                        <Ionicons name="person-circle-outline" size={20} color="#6B7280" />
                        <Text style={styles.instructor}>{courseData.instructor}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="star" size={16} color="#F59E0B" />
                            <Text style={styles.statText}>4.8 Rating</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={16} color="#6B7280" />
                            <Text style={styles.statText}>1.2k Students</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
                            <Text style={styles.statText}>12 Hours</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>About this Course</Text>
                    <Text style={styles.description}>{courseData.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>What you'll learn</Text>
                    {['Fundamentals and core concepts', 'Hands-on practical experience', 'Real world applications', 'Industry best practices'].map((item, index) => (
                        <View key={index} style={styles.learnItem}>
                            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                            <Text style={styles.learnText}>{item}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View>
                    <Text style={styles.priceLabel}>Price</Text>
                    <Text style={styles.price}>${courseData.price}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.enrollButton, enrolled && styles.enrolledButton]}
                    onPress={handleEnroll}
                >
                    <Text style={styles.enrollText}>
                        {enrolled ? '▶ Continue Learning' : 'Enroll Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    thumbnail: { width: '100%', height: 250 },
    content: { padding: 20 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    title: { fontSize: 22, fontWeight: 'bold', flex: 1, marginRight: 12 },
    instructorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
    instructor: { fontSize: 14, color: '#6B7280' },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 13, color: '#6B7280' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    description: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
    learnItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    learnText: { fontSize: 14, color: '#374151' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: 'white',
    },
    priceLabel: { fontSize: 12, color: '#6B7280' },
    price: { fontSize: 22, fontWeight: 'bold', color: '#3B82F6' },
    enrollButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    enrolledButton: { backgroundColor: '#10B981' },
    enrollText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});