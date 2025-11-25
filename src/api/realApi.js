import apiClient from './apiClient';
import { API_CONFIG } from './config';

// Функция для построения URL
const buildUrl = (endpoint, params = {}) => {
    let url = endpoint;
    Object.keys(params).forEach(key => {
        url = url.replace(`{${key}}`, params[key]);
    });
    return url;
};

// Админ функции
export const adminAPI = {
    // Заявки
    // getAllApplications: async (filters = {}) => {
    //     const url = API_CONFIG.BASE_URL + '/admin/applications/';
    //     return await apiClient.get(url, { params: filters });
    // },
    getAllApplications: async (filters = {}) => {
        const url = `${API_CONFIG.BASE_URL}/admin/applications`;  // 🔥 без последнего /
        return await apiClient.get(url, { params: filters });
    },


    getApplicationDetails: async (applicationId) => {
        const url = API_CONFIG.BASE_URL + `/admin/applications/${applicationId}`;
        return await apiClient.get(url);
    },

    updateApplicationStatus: async (applicationId, statusData) => {
        const url = API_CONFIG.BASE_URL + `/admin/applications/${applicationId}/status`;
        return await apiClient.put(url, statusData);
    },

    // getDashboardStats: async () => {
    //     const url = API_CONFIG.BASE_URL + '/admin/applications/stats/dashboard';
    //     return await apiClient.get(url);
    // },
    getDashboardStats: async () => {
        const url = API_CONFIG.BASE_URL + '/admin/applications/stats/';  // ❌
        return await apiClient.get(url);
    },


    // Пользователи
    getAllUsers: async () => {
        const url = API_CONFIG.BASE_URL + '/admin-users/';
        return await apiClient.get(url);
    },

    getUserDetails: async (userId) => {
        const url = API_CONFIG.BASE_URL + `/admin-users/${userId}`;
        return await apiClient.get(url);
    },

    updateUser: async (userId, userData) => {
        const url = API_CONFIG.BASE_URL + `/admin-users/${userId}`;
        return await apiClient.put(url, userData);
    },

    // Аудит
    getAuditLog: async () => {
        const url = API_CONFIG.BASE_URL + '/admin-reports/audit';
        return await apiClient.get(url);
    },

    exportApplications: async () => {
        const url = API_CONFIG.BASE_URL + '/admin-reports/export/applications';
        return await apiClient.get(url, { responseType: 'blob' });
    }
};

// Супер-админ функции
export const superAdminAPI = {
    getSystemHealth: async () => {
        const url = API_CONFIG.BASE_URL + '/super-admin/system/health';
        return await apiClient.get(url);
    },

    processPendingApplications: async () => {
        const url = API_CONFIG.BASE_URL + '/super-admin/system/scoring/process-pending';
        return await apiClient.post(url);
    },

    getAllAdmins: async () => {
        const url = API_CONFIG.BASE_URL + '/super-admin/admins';
        return await apiClient.get(url);
    },

    createAdmin: async (adminData) => {
        const url = API_CONFIG.BASE_URL + '/super-admin/admins';
        return await apiClient.post(url, adminData);
    },

    removeAdmin: async (userId) => {
        const url = API_CONFIG.BASE_URL + `/super-admin/admins/${userId}`;
        return await apiClient.delete(url);
    }
};

// Аутентификация
export const authAPI = {
    login: async (credentials) => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.LOGIN;
        console.log('🔐 Login URL:', url, credentials);
        return await apiClient.post(url, credentials);
    },

    register: async (userData) => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.REGISTER;
        console.log('📝 Register URL:', url, userData);
        return await apiClient.post(url, userData);
    },

    getProfile: async () => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.ME;
        return await apiClient.get(url);
    },

    updateSalary: async (salary) => {
        const url = API_CONFIG.BASE_URL + '/auth/users/me/salary';
        return await apiClient.put(url, { salary: salary });
    },

    updateProfile: async (profileData) => {
        const url = API_CONFIG.BASE_URL + '/auth/users/me';
        return await apiClient.put(url, profileData);
    }
};

// Кредитные заявки
export const applicationAPI = {
    create: async (applicationData) => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.APPLICATIONS.CREATE;
        console.log('📄 Create application URL:', url, applicationData);
        return await apiClient.post(url, applicationData);
    },

    getAll: async (filters = {}) => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.APPLICATIONS.LIST;
        return await apiClient.get(url, { params: filters });
    },

    getMyApplications: async () => {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.APPLICATIONS.LIST;
        console.log('📋 Get my applications URL:', url);
        return await apiClient.get(url);
    },

    getById: async (id) => {
        const url = API_CONFIG.BASE_URL +
            buildUrl(API_CONFIG.ENDPOINTS.APPLICATIONS.DETAIL, { id });
        return await apiClient.get(url);
    }
};

// Админ функции
// export const adminAPI = {
//     // Заявки
//     getAllApplications: async (filters = {}) => {
//         const url = API_CONFIG.BASE_URL + '/admin/applications/';
//         return await apiClient.get(url, { params: filters });
//     },

//     getApplicationDetails: async (applicationId) => {
//         const url = API_CONFIG.BASE_URL + `/admin/applications/${applicationId}`;
//         return await apiClient.get(url);
//     },

//     updateApplicationStatus: async (applicationId, statusData) => {
//         const url = API_CONFIG.BASE_URL + `/admin/applications/${applicationId}/status`;
//         return await apiClient.put(url, statusData);
//     },

//     getDashboardStats: async () => {
//         const url = API_CONFIG.BASE_URL + '/admin/applications/stats/dashboard';
//         return await apiClient.get(url);
//     },

//     // Пользователи
//     getAllUsers: async () => {
//         const url = API_CONFIG.BASE_URL + '/admin-users/';
//         return await apiClient.get(url);
//     },

//     getUserDetails: async (userId) => {
//         const url = API_CONFIG.BASE_URL + `/admin-users/${userId}`;
//         return await apiClient.get(url);
//     },

//     updateUser: async (userId, userData) => {
//         const url = API_CONFIG.BASE_URL + `/admin-users/${userId}`;
//         return await apiClient.put(url, userData);
//     }
// };

// // Супер-админ функции
// export const superAdminAPI = {
//     getSystemHealth: async () => {
//         const url = API_CONFIG.BASE_URL + '/super-admin/system/health';
//         return await apiClient.get(url);
//     },

//     processPendingApplications: async () => {
//         const url = API_CONFIG.BASE_URL + '/super-admin/system/scoring/process-pending';
//         return await apiClient.post(url);
//     },

//     getAuditLog: async () => {
//         const url = API_CONFIG.BASE_URL + '/admin-reports/audit';
//         return await apiClient.get(url);
//     },

//     exportApplications: async () => {
//         const url = API_CONFIG.BASE_URL + '/admin-reports/export/applications';
//         return await apiClient.get(url, { responseType: 'blob' });
//     },

//     // Управление админами
//     getAllAdmins: async () => {
//         const url = API_CONFIG.BASE_URL + '/super-admin/admins';
//         return await apiClient.get(url);
//     },

//     createAdmin: async (adminData) => {
//         const url = API_CONFIG.BASE_URL + '/super-admin/admins';
//         return await apiClient.post(url, adminData);
//     },

//     removeAdmin: async (userId) => {
//         const url = API_CONFIG.BASE_URL + `/super-admin/admins/${userId}`;
//         return await apiClient.delete(url);
//     }
// };