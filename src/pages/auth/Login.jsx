import { useState, useEffect } from "react"; // Добавил useEffect в импорт
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/realApi";
import { checkBackendHealth } from "../../api/apiClient";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        checkBackendConnection();
    }, []);

    const checkBackendConnection = async () => {
        const status = await checkBackendHealth();
        setBackendStatus(status);
        console.log("🔍 Статус бэкенда:", status);
    };

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setError("");
    };

    async function handleLogin(e) {
        e.preventDefault();

        if (!form.username.trim() || !form.password.trim()) {
            setError("Заполните все поля");
            return;
        }

        setLoading(true);
        setError("");

        console.log("🔄 Отправка запроса на /auth/login:", form);

        try {
            const response = await authAPI.login({
                username: form.username.trim(),
                password: form.password
            });

            console.log("✅ Успешный ответ:", response.data);

            const { access_token, token_type } = response.data;

            localStorage.setItem("authToken", access_token);
            localStorage.setItem("tokenType", token_type);

            console.log("🔑 Токен сохранен");

            // Получаем данные пользователя
            try {
                const profileResponse = await authAPI.getProfile();
                const userData = profileResponse.data;
                localStorage.setItem("userData", JSON.stringify(userData));
                console.log("👤 Данные пользователя:", userData);
                let userRole = 'USER';
                if (form.username === 'superadmin') {
                    userRole = 'SUPER_ADMIN';
                } else if (form.username.toLowerCase().includes('admin')) {
                    userRole = 'ADMIN';
                }
                localStorage.setItem("userRole", userRole);
                console.log("🎯 Роль пользователя сохранена:", userRole);
                console.log("📦 Проверка localStorage:", {
                    token: localStorage.getItem("authToken"),
                    role: localStorage.getItem("userRole"),
                    userData: localStorage.getItem("userData")
                });
            } catch (profileError) {
                console.warn("Не удалось получить профиль, но токен есть");
            }
            const profileResponse = await authAPI.getProfile();
            const userData = profileResponse.data;

            console.log("🔍 ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:", userData);
            console.log("🔍 ЕСТЬ ЛИ ROLE?", userData.role);
            console.log("🔍 ВСЕ ПОЛЯ:", Object.keys(userData));
            console.log("🚀 Перенаправляем в личный кабинет...");
            navigate("/dashboard");

        } catch (err) {
            console.error("❌ Ошибка входа:", err);

            const errorData = err.response?.data;

            if (errorData?.detail === "Incorrect username or password") {
                setError("Неверное имя пользователя или пароль");
            } else if (errorData?.detail === "Account is blocked or inactive") {
                setError("Аккаунт заблокирован или неактивен");
            } else if (errorData?.detail) {
                setError(errorData.detail);
            } else if (err.code === 'NETWORK_ERROR' || err.message?.includes('Network Error')) {
                setError("Нет соединения с сервером. Проверьте, запущен ли бэкенд.");
            } else {
                setError("Ошибка соединения с сервером");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
        >
            <Card sx={{ maxWidth: 400, width: "100%" }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Вход в систему
                    </Typography>

                    {/* Статус бэкенда */}
                    {backendStatus && !backendStatus.available && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            ⚠️ Бэкенд недоступен: {backendStatus.details}
                            <br />
                            <strong>Проверь:</strong>
                            <br />• Запущен ли бэкенд на localhost:8000?
                            <br />• Открывается ли http://localhost:8000/docs?
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin}>
                        <TextField
                            fullWidth
                            label="Имя пользователя"
                            value={form.username}
                            onChange={handleChange("username")}
                            margin="normal"
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            type="password"
                            value={form.password}
                            onChange={handleChange("password")}
                            margin="normal"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? "Вход..." : "Войти"}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                            onClick={() => navigate("/register")}
                            color="primary"
                        >
                            Нет аккаунта? Зарегистрироваться
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

// import { useState } from "react";
// import {
//     TextField,
//     Button,
//     Card,
//     CardContent,
//     Typography,
//     Box,
//     Alert
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";

// export default function Login() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     async function handleLogin(e) {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         console.log("Попытка входа:", { email, password }); // Отладка

//         try {
//             // Временная заглушка - пока бэкенд не готов
//             // TODO: Заменить на реальный вызов API
//             // const response = await authAPI.login({ email, password });

//             // Имитация успешного входа
//             setTimeout(() => {
//                 console.log("Вход успешен, сохраняем токен...");

//                 // Сохраняем фейковый токен и роль
//                 localStorage.setItem("authToken", "fake-jwt-token-" + Date.now());
//                 localStorage.setItem("userRole", "USER");

//                 console.log("Токен сохранен, перенаправляем...");
//                 navigate("/dashboard");
//             }, 1000);

//         } catch (err) {
//             console.error("Ошибка входа:", err);
//             setError("Ошибка входа. Проверьте email и пароль.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight="60vh"
//         >
//             <Card sx={{ maxWidth: 400, width: "100%" }}>
//                 <CardContent>
//                     <Typography variant="h4" component="h1" gutterBottom align="center">
//                         Вход в систему
//                     </Typography>

//                     {error && (
//                         <Alert severity="error" sx={{ mb: 2 }}>
//                             {error}
//                         </Alert>
//                     )}

//                     <Box component="form" onSubmit={handleLogin}>
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             margin="normal"
//                             required
//                             disabled={loading}
//                         />
//                         <TextField
//                             fullWidth
//                             label="Пароль"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             margin="normal"
//                             required
//                             disabled={loading}
//                         />
//                         <Button
//                             fullWidth
//                             type="submit"
//                             variant="contained"
//                             disabled={loading}
//                             sx={{ mt: 3 }}
//                         >
//                             {loading ? "Вход..." : "Войти"}
//                         </Button>
//                     </Box>

//                     <Box sx={{ mt: 2, textAlign: "center" }}>
//                         <Button
//                             onClick={() => navigate("/register")}
//                             color="primary"
//                         >
//                             Нет аккаунта? Зарегистрироваться
//                         </Button>
//                     </Box>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }