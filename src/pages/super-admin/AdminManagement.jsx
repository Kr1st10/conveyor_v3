import { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, Button, Box, Typography, Dialog, DialogActions,
    DialogContent, DialogTitle, TextField, Alert
} from '@mui/material';
import { superAdminAPI, adminAPI } from '../../api/realApi';

export default function AdminManagement() {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [adminsResponse, usersResponse] = await Promise.all([
                superAdminAPI.getAllAdmins(),
                adminAPI.getAllUsers()
            ]);

            setAdmins(adminsResponse.data.admins || []);
            setUsers(usersResponse.data.users || []);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setError('Не удалось загрузить данные');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (user) => {
        try {
            await superAdminAPI.createAdmin({
                user_id: user.id,
                permissions: { all: true }
            });
            setDialogOpen(false);
            loadData(); // Перезагружаем данные
        } catch (error) {
            console.error('Ошибка создания админа:', error);
            setError('Не удалось создать администратора');
        }
    };

    const getRoleColor = (role) => {
        const colors = { 'USER': 'default', 'ADMIN': 'primary', 'SUPER_ADMIN': 'secondary' };
        return colors[role] || 'default';
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Управление администраторами</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Button
                variant="contained"
                sx={{ mb: 3 }}
                onClick={() => setDialogOpen(true)}
            >
                Добавить администратора
            </Button>

            {/* Список админов */}
            <Typography variant="h6" gutterBottom>Текущие администраторы</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Имя пользователя</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {admins.map((admin) => (
                            <TableRow key={admin.id}>
                                <TableCell>#{admin.user_id}</TableCell>
                                <TableCell>{admin.username}</TableCell>
                                <TableCell>{admin.email}</TableCell>
                                <TableCell>
                                    <Chip label={admin.role_type} color={getRoleColor(admin.role_type)} />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        color="error"
                                        size="small"
                                        onClick={() => {/* TODO: удаление админа */ }}
                                    >
                                        Удалить
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог выбора пользователя */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Выберите пользователя для назначения администратором</DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Имя пользователя</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Действие</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.filter(user => !admins.find(admin => admin.user_id === user.id)).map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>#{user.id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleCreateAdmin(user)}
                                            >
                                                Назначить админом
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}