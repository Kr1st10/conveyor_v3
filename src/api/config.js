export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',
    TEST_MODE: false,
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            ME: '/auth/users/me'
        },
        APPLICATIONS: {
            CREATE: '/credit-applications/',
            LIST: '/credit-applications/user/all-applications', // ← ИЗМЕНИЛ на все заявки
            DETAIL: '/credit-applications/{id}',
            STATS: '/credit-applications/user/application-stats'
        }
    }
};