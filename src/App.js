import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardUser from "./pages/user/DashboardUser";
import ApplicationForm from "./pages/user/ApplicationForm";
import ApplicationStatus from "./pages/user/ApplicationStatus";
import RealAdminPanel from "./pages/admin/RealAdminPanel";
import EditProfile from "./pages/user/EditProfile";
import CreateAdmin from "./pages/superadmin/CreateAdmin";

// Защищенный маршрут
const ProtectedRoute = ({ children, roles = [] }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // 'USER', 'ADMIN', 'SUPER_ADMIN'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Если переданы роли, проверяем соответствие
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />; // не админ → редирект на юзерский дэшборд
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Пользовательские маршруты */}
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

          {/* Админ-панель */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <RealAdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/create-admin"
            element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <CreateAdmin />
              </ProtectedRoute>
            }
          />

          {/* Любой другой админский маршрут можно добавить аналогично */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
