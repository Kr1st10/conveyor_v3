import apiClient from './apiClient';

// Аутентификация
export const authAPI = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
};

// Заявки
export const applicationAPI = {
    create: (applicationData) => apiClient.post('/applications', applicationData),
    getAll: (filters = {}) => apiClient.get('/applications', { params: filters }),
    getById: (id) => apiClient.get(`/applications/${id}`),
    updateStatus: (id, status) => apiClient.patch(`/applications/${id}/status`, { status }),
};

// Админ функции
export const adminAPI = {
    getDashboard: () => apiClient.get('/admin/dashboard'),
    getUsers: () => apiClient.get('/admin/users'),
};