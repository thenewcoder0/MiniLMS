import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = 'https://api.freeapi.app';
const MAX_RETRIES = 3;
const TIMEOUT = 10000;

async function fetchWithTimeout(url: string, options: RequestInit) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timer);
    }
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<any> {
    try {
        const response = await fetchWithTimeout(url, options);
        return response.json();
    } catch (error: any) {
        if (retries > 0 && error.name !== 'AbortError') {
            await new Promise(res => setTimeout(res, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

export const storage = {
    async setToken(token: string) {
        await SecureStore.setItemAsync('token', token);
    },
    async getToken() {
        return await SecureStore.getItemAsync('token');
    },
    async deleteToken() {
        await SecureStore.deleteItemAsync('token');
    },
    async setRefreshToken(token: string) {
        await SecureStore.setItemAsync('refreshToken', token);
    },
    async getRefreshToken() {
        return await SecureStore.getItemAsync('refreshToken');
    },
    async deleteRefreshToken() {
        await SecureStore.deleteItemAsync('refreshToken');
    },
};

export const api = {
    async get(endpoint: string) {
        const token = await storage.getToken();
        return fetchWithRetry(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    },

    async post(endpoint: string, body: object) {
        const token = await storage.getToken();
        return fetchWithRetry(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        });
    },
};