// import { useState, useEffect } from 'react';
// import {
//     Grid, Card, CardContent, Typography, Box,
//     Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Paper, Chip, Button
// } from '@mui/material';
// import { adminAPI } from '../../api/realApi';

// export default function DashboardAdmin() {
//     const [stats, setStats] = useState(null);
//     const [recentApplications, setRecentApplications] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadDashboardData();
//     }, []);

//     const loadDashboardData = async () => {
//         try {
//             const [statsResponse, applicationsResponse] = await Promise.all([
//                 adminAPI.getDashboardStats(),
//                 adminAPI.getAllApplications({ size: 5 })
//             ]);

//             setStats(statsResponse.data);
//             setRecentApplications(applicationsResponse.data.items || []);
//         } catch (error) {
//             console.error('Ошибка загрузки дашборда:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getStatusColor = (status) => {
//         const colors = {
//             'pending': 'warning',
//             'approved': 'success',
//             'rejected': 'error',
//             'processing': 'info'
//         };
//         return colors[status] || 'default';
//     };

//     if (loading) return <Typography>Загрузка...</Typography>;

//     return (
//         <Box>
//             <Typography variant="h4" gutterBottom>Админ панель</Typography>

//             {/* Статистика */}
//             {stats && (
//                 <Grid container spacing={3} sx={{ mb: 4 }}>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography color="textSecondary" gutterBottom>Всего заявок</Typography>
//                                 <Typography variant="h5">{stats.total_applications}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography color="textSecondary" gutterBottom>Одобрено</Typography>
//                                 <Typography variant="h5" color="success.main">{stats.approved_applications}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography color="textSecondary" gutterBottom>Отклонено</Typography>
//                                 <Typography variant="h5" color="error.main">{stats.rejected_applications}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={3}>
//                         <Card>
//                             <CardContent>
//                                 <Typography color="textSecondary" gutterBottom>На проверке</Typography>
//                                 <Typography variant="h5" color="warning.main">{stats.pending_applications}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             )}

//             {/* Последние заявки */}
//             <Card>
//                 <CardContent>
//                     <Typography variant="h6" gutterBottom>Последние заявки</Typography>
//                     <TableContainer component={Paper}>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>ID</TableCell>
//                                     <TableCell>Пользователь</TableCell>
//                                     <TableCell>Сумма</TableCell>
//                                     <TableCell>Статус</TableCell>
//                                     <TableCell>Дата</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {recentApplications.map((app) => (
//                                     <TableRow key={app.id}>
//                                         <TableCell>#{app.id}</TableCell>
//                                         <TableCell>User #{app.user_id}</TableCell>
//                                         <TableCell>{app.loan_amount?.toLocaleString()} руб.</TableCell>
//                                         <TableCell>
//                                             <Chip
//                                                 label={app.status}
//                                                 color={getStatusColor(app.status)}
//                                                 size="small"
//                                             />
//                                         </TableCell>
//                                         <TableCell>
//                                             {new Date(app.created_at).toLocaleDateString()}
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>

//                     <Button
//                         variant="outlined"
//                         sx={{ mt: 2 }}
//                         onClick={() => window.location.href = '/admin/applications'}
//                     >
//                         Все заявки
//                     </Button>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }

import { useState, useEffect } from 'react';
import {
    Grid, Card, CardContent, Typography, Box,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Button,
    Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../api/realApi';

export default function DashboardAdmin() {
    const [stats, setStats] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboardData();
    }, []);

    // const loadDashboardData = async () => {
    //     try {
    //         const [statsResponse, applicationsResponse] = await Promise.all([
    //             adminAPI.getDashboardStats(),
    //             adminAPI.getAllApplications({ size: 5 })
    //         ]);

    //         setStats(statsResponse.data);
    //         setRecentApplications(applicationsResponse.data.items || []);
    //     } catch (error) {
    //         console.error('Ошибка загрузки дашборда:', error);
    //         setError('Не удалось загрузить данные. Проверьте права доступа.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const loadDashboardData = async () => {
        try {
            console.log("🔄 Загрузка данных админ-панели...");

            const statsResponse = await adminAPI.getDashboardStats();
            console.log("📊 Ответ статистики:", statsResponse);

            const applicationsResponse = await adminAPI.getAllApplications({ size: 5 });
            console.log("📋 Ответ заявок:", applicationsResponse);

            setStats(statsResponse.data);
            setRecentApplications(applicationsResponse.data?.items || applicationsResponse.data || []);

        } catch (error) {
            console.error('❌ Ошибка загрузки дашборда:', error);
            console.error('🔧 Детали ошибки:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });

            setError(`Ошибка: ${error.response?.data?.detail || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'warning',
            'approved': 'success',
            'rejected': 'error',
            'processing': 'info',
            'manual_review': 'secondary'
        };
        return colors[status] || 'default';
    };

    if (loading) return <Typography>Загрузка админ-панели...</Typography>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Админ панель
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Статистика */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Всего заявок</Typography>
                                <Typography variant="h5">{stats.total_applications || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Одобрено</Typography>
                                <Typography variant="h5" color="success.main">
                                    {stats.approved_applications || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Отклонено</Typography>
                                <Typography variant="h5" color="error.main">
                                    {stats.rejected_applications || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>На проверке</Typography>
                                <Typography variant="h5" color="warning.main">
                                    {stats.pending_applications || 0}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Быстрые действия */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Быстрые действия</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/admin/applications"
                        >
                            Управление заявками
                        </Button>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/admin/users"
                        >
                            Управление пользователями
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={loadDashboardData}
                        >
                            Обновить данные
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Последние заявки */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Последние заявки</Typography>

                    {recentApplications.length === 0 ? (
                        <Typography color="textSecondary">Нет заявок для отображения</Typography>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Пользователь</TableCell>
                                        <TableCell>Сумма</TableCell>
                                        <TableCell>Статус</TableCell>
                                        <TableCell>Дата</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentApplications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell>#{app.id}</TableCell>
                                            <TableCell>User #{app.user_id}</TableCell>
                                            <TableCell>{app.loan_amount?.toLocaleString()} руб.</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={app.status}
                                                    color={getStatusColor(app.status)}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Date(app.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        component={Link}
                        to="/admin/applications"
                    >
                        Все заявки
                    </Button>
                    {/* 🌟 КНОПКА, КОТОРУЮ ВЫ ИСКАЛИ: ПРОСМОТР ВСЕХ ЗАЯВОК */}
                    <Button
                        variant="contained"
                        color="success"
                        component={Link}
                        to="/admin/applications" // Используйте здесь ПРАВИЛЬНЫЙ рабочий путь
                    >
                        Просмотр всех заявок
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}