import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function OfflineBanner() {
    return (
        <View style={styles.banner}>
            <Ionicons name="cloud-offline-outline" size={16} color="white" />
            <Text style={styles.text}>No internet connection</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    banner: {
        backgroundColor: '#EF4444',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    text: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
    },
});