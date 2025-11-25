import axios from 'axios';
import { API_CONFIG } from './config';

// Функция для проверки доступности бэкенда
export const checkBackendHealth = async () => {
    try {
        const response = await axios.get(`${API_CONFIG.BASE_URL}/docs`, { timeout: 5000 });
        return { available: true, status: response.status };
    } catch (error) {
        return {
            available: false,
            error: error.message,
            details: `Бэкенд недоступен по адресу: ${API_CONFIG.BASE_URL}`
        };
    }
};

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Перехватчик для добавления JWT токена
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
});

// Перехватчик для обработки ошибок
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error(`❌ ${error.response?.status} ${error.config?.url}:`, error.response?.data);

        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;