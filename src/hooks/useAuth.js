// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export function useAuth() {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const checkAuth = () => {
//         const token = localStorage.getItem('authToken');
//         const role = localStorage.getItem('userRole');

//         console.log("Проверка аутентификации:", { token, role });

//         if (token) {
//             setIsAuthenticated(true);
//             setUserRole(role);
//         }
//         setLoading(false);
//     };

//     const login = (token, role) => {
//         console.log("Логин:", { token, role });
//         localStorage.setItem('authToken', token);
//         localStorage.setItem('userRole', role);
//         setIsAuthenticated(true);
//         setUserRole(role);
//     };

//     const logout = () => {
//         console.log("Выход из системы");
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userRole');
//         localStorage.removeItem('userData');
//         setIsAuthenticated(false);
//         setUserRole(null);
//         navigate('/login');
//     };

//     return {
//         isAuthenticated,
//         userRole,
//         login,
//         logout,
//         loading
//     };
// }

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/realApi';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // Получаем данные пользователя
            const response = await authAPI.getProfile();
            const user = response.data;

            setUserData(user);
            setIsAuthenticated(true);

            // Определяем роль (пока просто ставим USER, потом доработаем)
            // TODO: Нужен эндпоинт для проверки прав админа
            setUserRole('USER');

        } catch (error) {
            console.error('Ошибка проверки аутентификации:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (token, userData) => {
        localStorage.setItem('authToken', token);
        setUserData(userData);
        setIsAuthenticated(true);
        setUserRole(userData.role || 'USER');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserData(null);
        navigate('/login');
    };

    return {
        isAuthenticated,
        userRole,
        userData,
        login,
        logout,
        loading
    };
}