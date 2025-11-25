import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Alert,
    Grid
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { applicationAPI } from "../../api/realApi";

export default function ApplicationForm() {
    const [form, setForm] = useState({
        passport_number: "", // ← ИЗМЕНИЛ НА passport_number
        inn: "",
        loan_amount: "",     // ← ИЗМЕНИЛ НА loan_amount
        loan_term: ""        // ← ИЗМЕНИЛ НА loan_term
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    // Загружаем данные пользователя при монтировании
    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            setUserData(user);
            console.log("👤 Данные пользователя:", user);
        }
    }, []);

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));

        // Очищаем ошибку при изменении поля
        setErrors(prev => ({ ...prev, [field]: "" }));
    };

    // Валидация полей по схеме бэкенда
    const validateField = (field, value) => {
        switch (field) {
            case "passport_number":
                if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) {
                    return "Паспорт должен содержать 10 цифр (серия и номер)";
                }
                break;
            case "inn":
                if (!/^\d{12}$/.test(value)) {
                    return "ИНН должен содержать 12 цифр";
                }
                break;
            case "loan_amount":
                const amount = parseFloat(value);
                if (!amount || amount < 10000 || amount > 5000000) {
                    return "Сумма кредита должна быть от 10,000 до 5,000,000 руб.";
                }
                break;
            case "loan_term":
                const term = parseInt(value);
                if (!term || term < 6 || term > 60) { // ← ИЗМЕНИЛ на 6-60 месяцев
                    return "Срок кредита должен быть от 6 до 60 месяцев";
                }
                break;
            default:
                return "";
        }
        return "";
    };

    const validateForm = () => {
        const newErrors = {};

        Object.keys(form).forEach(field => {
            const error = validateField(field, form[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("🔍 ДАННЫЕ ДЛЯ SCORING:", {
            userData: userData,
            userSalary: userData?.salary,
            hasSalary: !!userData?.salary
        });
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // ТОЧНЫЙ формат по схеме CreditApplicationCreate
            const applicationData = {
                passport_number: form.passport_number.replace(/\s/g, ''), // ← 10 цифр без пробелов
                inn: form.inn,                                            // ← 12 цифр
                loan_amount: parseFloat(form.loan_amount),                // ← число с плавающей точкой
                loan_term: parseInt(form.loan_term),                      // ← целое число
                user_id: userData?.id,                                     // ← ID пользователя из профиля
                user_salary: userData?.salary // ← ДОБАВИЛ ЗАРПЛАТУ ДЛЯ SCORING
            };

            console.log("📤 Данные заявки для бэкенда:", applicationData);
            console.log("📄 Отправка заявки:", applicationData);
            const response = await applicationAPI.create(applicationData);

            console.log("✅ Заявка создана:", response.data);

            // Сохраняем ID заявки для страницы статуса
            localStorage.setItem("lastAppId", response.data.id);

            alert(`Заявка №${response.data.id} успешно подана!`);
            navigate("/dashboard");

        } catch (err) {
            console.error("❌ Ошибка при создании заявки:", err);

            const errorData = err.response?.data;
            console.log("📋 Данные ошибки:", errorData);

            if (errorData?.detail) {
                setErrors({ submit: errorData.detail });
            } else if (Array.isArray(errorData)) {
                const errorMessages = errorData.map(err => {
                    const field = err.loc?.[1] || 'данные';
                    return `${field}: ${err.msg}`;
                }).join(', ');
                setErrors({ submit: `Ошибки валидации: ${errorMessages}` });
            } else {
                setErrors({ submit: "Ошибка при отправке заявки. Попробуйте еще раз." });
            }
        } finally {
            setLoading(false);
        }
    };

    // Форматирование паспорта (автоматическая расстановка пробелов для удобства)
    const formatPassport = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 4) return numbers;
        return numbers.slice(0, 4) + ' ' + numbers.slice(4, 10);
    };

    const handlePassportChange = (e) => {
        const value = e.target.value;
        const formatted = formatPassport(value);
        setForm(prev => ({ ...prev, passport_number: formatted }));
        setErrors(prev => ({ ...prev, passport_number: "" }));
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Подача заявки на кредит
                </Typography>

                {/* Информация о пользователе */}
                {userData && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Заявка оформляется на:</strong> {userData.full_name}
                        <br />
                        <strong>Username:</strong> {userData.username}
                        <br />
                        <strong>Email:</strong> {userData.email}
                    </Alert>
                )}

                {errors.submit && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.submit}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Паспорт (серия и номер)"
                                value={form.passport_number}
                                onChange={handlePassportChange}
                                error={!!errors.passport_number}
                                helperText={errors.passport_number || "10 цифр (серия 4 цифры + номер 6 цифр)"}
                                placeholder="4510 123456"
                                disabled={loading}
                                inputProps={{ maxLength: 11 }} // 4 цифры + пробел + 6 цифр
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="ИНН"
                                value={form.inn}
                                onChange={handleChange("inn")}
                                error={!!errors.inn}
                                helperText={errors.inn || "12 цифр"}
                                placeholder="123456789012"
                                disabled={loading}
                                inputProps={{ maxLength: 12 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Сумма кредита (руб.)"
                                type="number"
                                value={form.loan_amount}
                                onChange={handleChange("loan_amount")}
                                error={!!errors.loan_amount}
                                helperText={errors.loan_amount || "От 10,000 до 5,000,000 руб."}
                                disabled={loading}
                                InputProps={{
                                    inputProps: {
                                        min: 10000,
                                        max: 5000000,
                                        step: 1000
                                    }
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Срок кредита (мес.)"
                                type="number"
                                value={form.loan_term}
                                onChange={handleChange("loan_term")}
                                error={!!errors.loan_term}
                                helperText={errors.loan_term || "От 6 до 60 месяцев"}
                                disabled={loading}
                                InputProps={{
                                    inputProps: {
                                        min: 6,
                                        max: 60
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading || !userData}
                        sx={{ mt: 3 }}
                        size="large"
                    >
                        {loading ? "Отправка..." : "Подать заявку на кредит"}
                    </Button>
                </Box>

                {/* Подсказка по тестовым данным */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        <strong>Тестовые данные для проверки:</strong>
                        <br />• Паспорт: 4510 123456 (10 цифр)
                        <br />• ИНН: 123456789012 (12 цифр)
                        <br />• Сумма: 500000 (от 10,000 до 5,000,000)
                        <br />• Срок: 24 (от 6 до 60 месяцев)
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

// import { useState } from "react";
// import { createApplication } from "../../api/fakeApi";
// import { useNavigate } from "react-router-dom";

// export default function ApplicationForm() {
//     const [form, setForm] = useState({ fio: "", passport: "", inn: "", sum: "", term: "" });
//     const navigate = useNavigate();

//     function handleChange(e) {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     }

//     async function handleSubmit() {
//         const app = await createApplication(form);
//         localStorage.setItem("lastAppId", app.id);
//         alert(`Заявка №${app.id} создана`);
//         navigate("/status");
//     }

//     return (
//         <div style={{ padding: 20 }}>
//             <h2>Подача заявки</h2>

//             {["fio", "passport", "inn", "sum", "term"].map((f) => (
//                 <div key={f} style={{ marginBottom: "10px" }}>
//                     <input
//                         name={f}
//                         placeholder={f.toUpperCase()}
//                         onChange={handleChange}
//                     />
//                 </div>
//             ))}

//             <button onClick={handleSubmit}>Отправить</button>
//         </div>
//     );
// }

//return <h1>Форма работает!</h1>;


// return (
//     <div style={{ padding: 20 }}>
//         <h2>Подача заявки</h2>
//         {["fio", "passport", "inn", "sum", "term"].map(f => (
//     <input key={f} name={f} placeholder={f} onChange={handleChange} /><br/>
//         ))}
//         <button onClick={handleSubmit}>Отправить</button>
//     </div>
// );

// import React, { useState } from "react";
// import { addApplication } from "../api/fakeApi";
// import { useNavigate } from "react-router-dom";

// export default function ApplicationForm() {
//     const [form, setForm] = useState({ fio: "", inn: "", passport: "", amount: "", term: "" });
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     const validate = () => {
//         const errs = {};
//         if (!form.fio) errs.fio = "Введите ФИО";
//         if (!/^\d{12}$/.test(form.inn)) errs.inn = "ИНН должен содержать 12 цифр";
//         if (!/^\d{10}$/.test(form.passport)) errs.passport = "Паспорт должен содержать 10 цифр";
//         if (form.amount < 10000 || form.amount > 5000000) errs.amount = "Сумма должна быть от 10 000 до 5 000 000";
//         if (form.term < 6 || form.term > 60) errs.term = "Срок кредита от 6 до 60 месяцев";
//         setErrors(errs);
//         return Object.keys(errs).length === 0;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validate()) {
//             addApplication(form);
//             alert("Заявка отправлена!");
//             navigate("/dashboard");
//         }
//     };

//     return (
//         <div>
//             <h2>Подача заявки на кредит</h2>
//             <form onSubmit={handleSubmit}>
//                 <input placeholder="ФИО" value={form.fio} onChange={e => setForm({ ...form, fio: e.target.value })} />
//                 <div style={{ color: "red" }}>{errors.fio}</div>
//                 <input placeholder="ИНН" value={form.inn} onChange={e => setForm({ ...form, inn: e.target.value })} />
//                 <div style={{ color: "red" }}>{errors.inn}</div>
//                 <input placeholder="Паспорт" value={form.passport} onChange={e => setForm({ ...form, passport: e.target.value })} />
//                 <div style={{ color: "red" }}>{errors.passport}</div>
//                 <input type="number" placeholder="Сумма кредита" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
//                 <div style={{ color: "red" }}>{errors.amount}</div>
//                 <input type="number" placeholder="Срок (мес.)" value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} />
//                 <div style={{ color: "red" }}>{errors.term}</div>
//                 <button type="submit">Отправить на проверку</button>
//             </form>
//         </div>
//     );
// }

