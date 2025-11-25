import { useState } from "react";
import {
    Card, CardContent, Typography, TextField, Button, Alert, Grid
} from "@mui/material";
import { superAdminAPI } from "../../api/realApi";

export default function CreateAdmin() {
    const [form, setForm] = useState({
        full_name: "",
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const newAdmin = {
                full_name: form.full_name.trim(),
                username: form.username.trim(),
                password: form.password
            };

            console.log("Создание нового админа:", newAdmin);
            await superAdminAPI.createAdmin(newAdmin);

            setSuccess("Новый админ успешно создан!");
            setForm({ full_name: "", username: "", password: "" });
        } catch (err) {
            console.error("Ошибка создания админа:", err);
            setError(err.response?.data?.message || "Ошибка создания админа");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Создать нового администратора
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Имя"
                                value={form.full_name}
                                onChange={handleChange("full_name")}
                                required
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Никнейм"
                                value={form.username}
                                onChange={handleChange("username")}
                                required
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Пароль"
                                type="password"
                                value={form.password}
                                onChange={handleChange("password")}
                                required
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? "Создание..." : "Создать администратора"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
}
