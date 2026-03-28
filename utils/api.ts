import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.freeapi.app';

export const api = {
    async get(endpoint: string) {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        return response.json();
    },

    async post(endpoint: string, body: object) {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        });
        return response.json();
    },
};