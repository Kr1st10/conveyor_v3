import { useState } from "react";
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

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        phone_number: "",
        salary: "" // ← ДОБАВИЛ ПОЛЕ ЗАРПЛАТЫ
    });
    // jdksjfkdjfkdjfk
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setError("");
    };

    // Валидация пароля по требованиям бэкенда
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Пароль должен содержать минимум 8 символов";
        }
        if (!/[A-Z]/.test(password)) {
            return "Пароль должен содержать хотя бы одну заглавную букву";
        }
        if (!/[a-z]/.test(password)) {
            return "Пароль должен содержать хотя бы одну строчную букву";
        }
        if (!/\d/.test(password)) {
            return "Пароль должен содержать хотя бы одну цифру";
        }
        return "";
    };

    async function handleRegister(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Валидация
        if (!form.username.trim() || !form.email.trim() || !form.full_name.trim()) {
            setError("Заполните все обязательные поля");
            setLoading(false);
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Пароли не совпадают");
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(form.password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        // Валидация username (только буквы, цифры, подчеркивания)
        if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
            setError("Имя пользователя может содержать только буквы, цифры и подчеркивания");
            setLoading(false);
            return;
        }

        try {
            // ТОЧНЫЙ формат по схеме RegisterRequest
            const userData = {
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
                full_name: form.full_name.trim(),
                phone_number: form.phone_number.trim() || null,
                salary: form.salary ? parseFloat(form.salary) : null // ← ДОБАВИЛ
            };

            console.log("📝 Отправка данных регистрации:", userData);
            const response = await authAPI.register(userData);

            console.log("✅ Успешная регистрация:", response.data);

            alert("Регистрация успешна! Теперь войдите в систему.");
            navigate("/login");

        } catch (err) {
            console.error("❌ Ошибка регистрации:", err);

            const errorData = err.response?.data;
            console.log("📋 Данные ошибки:", errorData);

            // Обработка ошибок валидации FastAPI
            if (errorData?.detail) {
                setError(errorData.detail);
            } else if (Array.isArray(errorData)) {
                // Обработка ошибок Pydantic
                const errorMessages = errorData.map(err => {
                    const field = err.loc?.[1] || 'данные';
                    return `${field}: ${err.msg}`;
                }).join(', ');
                setError(`Ошибки в данных: ${errorMessages}`);
            } else {
                setError("Ошибка регистрации. Проверьте введенные данные.");
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
            <Card sx={{ maxWidth: 500, width: "100%" }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Регистрация
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleRegister}>
                        <TextField
                            fullWidth
                            label="Имя пользователя *"
                            value={form.username}
                            onChange={handleChange("username")}
                            margin="normal"
                            required
                            disabled={loading}
                            helperText="Только английские буквы, цифры и _"
                            error={form.username && !/^[a-zA-Z0-9_]+$/.test(form.username)}
                        />
                        <TextField
                            fullWidth
                            label="Email *"
                            type="email"
                            value={form.email}
                            onChange={handleChange("email")}
                            margin="normal"
                            required
                            disabled={loading}
                        />
                        <TextField
                            fullWidth
                            label="Полное имя *"
                            value={form.full_name}
                            onChange={handleChange("full_name")}
                            margin="normal"
                            required
                            disabled={loading}
                            placeholder="Иванов Иван Иванович"
                        />
                        <TextField
                            fullWidth
                            label="Номер телефона"
                            value={form.phone_number}
                            onChange={handleChange("phone_number")}
                            margin="normal"
                            disabled={loading}
                            placeholder="+79161234567"
                        />
                        <TextField
                            fullWidth
                            label="Пароль *"
                            type="password"
                            value={form.password}
                            onChange={handleChange("password")}
                            margin="normal"
                            required
                            disabled={loading}
                            helperText="Минимум 8 символов, заглавная, строчная буква и цифра"
                            error={form.password && validatePassword(form.password)}
                        />
                        <TextField
                            fullWidth
                            label="Подтвердите пароль *"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            margin="normal"
                            required
                            disabled={loading}
                            error={form.confirmPassword && form.password !== form.confirmPassword}
                        />

                        <TextField
                            fullWidth
                            label="Зарплата (руб.)"
                            type="number"
                            value={form.salary}
                            onChange={handleChange("salary")}
                            margin="normal"
                            disabled={loading}
                            placeholder="50000"
                            helperText="Укажите вашу месячную зарплату"
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    max: 10000000,
                                    step: 1000
                                }
                            }}
                        />


                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ mt: 3 }}
                        >
                            {loading ? "Регистрация..." : "Зарегистрироваться"}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                            onClick={() => navigate("/login")}
                            color="primary"
                        >
                            Уже есть аккаунт? Войти
                        </Button>
                    </Box>

                    {/* Подсказка по тестовым данным */}
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            <strong>Тестовые данные для проверки:</strong>
                            <br />Username: test_user123
                            <br />Email: test@example.com
                            <br />Full name: Тестовый Пользователь
                            <br />Password: Test12345 (заглавная + строчная + цифры)
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}