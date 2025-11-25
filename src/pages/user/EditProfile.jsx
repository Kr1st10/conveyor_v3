import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Alert
} from "@mui/material";
import { authAPI } from "../../api/realApi";

export default function EditProfile() {
    const [salary, setSalary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadSalary();
    }, []);

    const loadSalary = async () => {
        try {
            const response = await authAPI.getProfile();
            setSalary(response.data.salary ? response.data.salary.toString() : "");
        } catch (err) {
            console.error("Ошибка загрузки зарплаты:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const salaryValue = parseFloat(salary);
            if (isNaN(salaryValue) || salaryValue < 0) {
                setError("Введите корректную зарплату");
                setLoading(false);
                return;
            }

            await authAPI.updateSalary(salaryValue);
            setSuccess("Зарплата успешно обновлена!");
        } catch (err) {
            console.error("Ошибка обновления зарплаты:", err);
            setError("Не удалось обновить зарплату");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Редактирование зарплаты
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Зарплата (руб./мес)"
                        type="number"
                        value={salary}
                        onChange={e => setSalary(e.target.value)}
                        disabled={loading}
                        placeholder="50000"
                        helperText="Укажите вашу месячную зарплату для улучшения скоринга"
                        InputProps={{
                            inputProps: {
                                min: 0,
                                max: 10000000,
                                step: 1000
                            }
                        }}
                        sx={{ mb: 2 }}
                    />

                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
