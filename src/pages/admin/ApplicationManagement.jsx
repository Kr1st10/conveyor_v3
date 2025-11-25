import { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, Button, Box, Typography, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, MenuItem, Alert
} from '@mui/material';
import { adminAPI } from '../../api/realApi';

export default function ApplicationManagement() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const response = await adminAPI.getAllApplications();
            setApplications(response.data.items || []);
        } catch (error) {
            console.error('Ошибка загрузки заявок:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await adminAPI.updateApplicationStatus(selectedApp.id, { status: newStatus });
            setStatusDialogOpen(false);
            loadApplications(); // Перезагружаем список
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'warning', 'approved': 'success', 'rejected': 'error', 'processing': 'info'
        };
        return colors[status] || 'default';
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Управление заявками</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Пользователь</TableCell>
                            <TableCell>Сумма</TableCell>
                            <TableCell>Срок</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Scoring</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {applications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>#{app.id}</TableCell>
                                <TableCell>User #{app.user_id}</TableCell>
                                <TableCell>{app.loan_amount?.toLocaleString()} руб.</TableCell>
                                <TableCell>{app.loan_term} мес.</TableCell>
                                <TableCell>
                                    <Chip label={app.status} color={getStatusColor(app.status)} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={app.scoring_status || 'не обработан'}
                                        variant="outlined"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            setSelectedApp(app);
                                            setNewStatus(app.status);
                                            setStatusDialogOpen(true);
                                        }}
                                    >
                                        Изменить статус
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог изменения статуса */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
                <DialogTitle>Изменение статуса заявки #{selectedApp?.id}</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        fullWidth
                        label="Новый статус"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="pending">Ожидает</MenuItem>
                        <MenuItem value="processing">В обработке</MenuItem>
                        <MenuItem value="approved">Одобрено</MenuItem>
                        <MenuItem value="rejected">Отклонено</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>Отмена</Button>
                    <Button onClick={handleStatusUpdate} variant="contained">Сохранить</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}