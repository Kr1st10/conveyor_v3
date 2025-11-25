import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardUser from "./pages/user/DashboardUser";
import ApplicationForm from "./pages/user/ApplicationForm";
import ApplicationStatus from "./pages/user/ApplicationStatus";
import DashboardAdmin from './pages/admin/DashboardAdmin';

import DashboardAdmin from './pages/admin/DashboardAdmin';
import ApplicationManagement from './pages/admin/ApplicationManagement';
import UserManagement from './pages/admin/UserManagement';
import DashboardSuperAdmin from './pages/super-admin/DashboardSuperAdmin';

import EditProfile from './pages/user/EditProfile';

import RealAdminPanel from './pages/admin/RealAdminPanel';

// Защищенный маршрут с проверкой роли
const ProtectedRoute = ({ children, requiredRole = null }) => {
    const isAuthenticated = !!localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Админский маршрут
const AdminRoute = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            {children}
        </ProtectedRoute>
    );
};

// Супер-админский маршрут  
const SuperAdminRoute = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="SUPER_ADMIN">
            {children}
        </ProtectedRoute>
    );
};
// Защищенный маршрут
// const ProtectedRoute = ({ children }) => {
//     const isAuthenticated = !!localStorage.getItem('authToken');

//     console.log("ProtectedRoute проверка:", {
//         isAuthenticated,
//         token: localStorage.getItem('authToken')
//     });

//     if (!isAuthenticated) {
//         console.log("Не авторизован, перенаправляем на /login");
//         return <Navigate to="/login" replace />;
//     }

//     console.log("Авторизован, показываем содержимое");
//     return children;
// };

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardUser />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/apply"
                        element={
                            <ProtectedRoute>
                                <ApplicationForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/status"
                        element={
                            <ProtectedRoute>
                                <ApplicationStatus />
                            </ProtectedRoute>
                        }
                    />
                    {/* <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardAdmin />
                            </ProtectedRoute>
                        }
                    /> */}
                    <Route
                        path="/edit-profile"
                        element={
                            <ProtectedRoute>
                                <EditProfile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute>
                                <RealAdminPanel />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
                    <Route path="/admin/applications" element={<ProtectedRoute><ApplicationManagement /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                    <Route path="/super-admin" element={<ProtectedRoute><DashboardSuperAdmin /></ProtectedRoute>} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;