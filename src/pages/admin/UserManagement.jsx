import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Select, MenuItem,
    Typography, Chip, FormControl, Alert, Snackbar
} from '@mui/material';
import { superAdminApi } from '../../api/realApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    // Загружаем пользователей при старте
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await superAdminApi.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Ошибка загрузки пользователей", error);
        }
    };

    // Обработчик смены роли
    const handleRoleChange = async (userId, newRole) => {
        try {
            // 1. Вызываем API
            await superAdminApi.updateUserRole(userId, newRole);

            // 2. Оптимистично обновляем интерфейс (чтобы не ждать перезагрузки таблицы)
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );

            // 3. Показываем уведомление
            setNotification({ open: true, message: `Роль успешно изменена на ${newRole}`, severity: 'success' });

        } catch (error) {
            setNotification({ open: true, message: 'Ошибка при смене роли', severity: 'error' });
        }
    };

    // Цвета для разных ролей (для красоты)
    const getRoleColor = (role) => {
        switch (role) {
            case 'super_admin': return 'error'; // Красный
            case 'admin': return 'warning';     // Оранжевый
            case 'user': return 'primary';      // Синий
            default: return 'default';
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Управление пользователями</Typography>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Email / Имя</TableCell>
                            <TableCell>Текущий статус</TableCell>
                            <TableCell>Действие (Сменить роль)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <Typography variant="body1">{user.full_name}</Typography>
                                    <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        color={getRoleColor(user.role)}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" fullWidth>
                                        <Select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="user">User</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                            {/* Опционально: можно запретить назначать других супер-админов */}
                                            <MenuItem value="super_admin">Super Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Уведомления об успехе/ошибке */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
            >
                <Alert severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default UserManagement;