import { useState, useEffect } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../../api/realApi';

export default function DashboardUser() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🎯 Dashboard mounted, loading applications...");
        loadMyApplications();
    }, []);

    const loadMyApplications = async () => {
        try {
            console.log("🔄 Загрузка ВСЕХ заявок пользователя...");
            const response = await applicationAPI.getMyApplications();
            console.log("✅ Все заявки получены:", response.data);

            // Теперь response.data имеет структуру {items: [], total: , page: , size: , pages: }
            setApplications(response.data.items || []);
        } catch (error) {
            console.error('❌ Ошибка загрузки заявок:', error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    // const loadMyApplications = async () => {
    //     try {
    //         console.log("🔄 Загрузка заявок пользователя...");

    //         // Пробуем получить все заявки через активные
    //         const response = await applicationAPI.getMyApplications();
    //         console.log("✅ Активные заявки:", response.data);

    //         // Если нет активных, но мы знаем ID заявки - получаем ее отдельно
    //         const lastAppId = localStorage.getItem("lastAppId");
    //         if (response.data.length === 0 && lastAppId) {
    //             console.log("🔄 Загружаем конкретную заявку по ID:", lastAppId);
    //             const appResponse = await applicationAPI.getById(lastAppId);
    //             setApplications([appResponse.data]);
    //         } else {
    //             setApplications(response.data);
    //         }

    //     } catch (error) {
    //         console.error('❌ Ошибка загрузки заявок:', error);
    //         setApplications([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const getStatusColor = (status) => {
        const colors = {
            'new': 'primary',
            'in_progress': 'warning',
            'approved': 'success',
            'rejected': 'error',
            'pending': 'info'
        };
        return colors[status] || 'default';
    };

    const getStatusText = (status) => {
        const texts = {
            'new': 'Новая',
            'in_progress': 'В обработке',
            'approved': 'Одобрена',
            'rejected': 'Отклонена',
            'pending': 'Ожидает'
        };
        return texts[status] || status;
    };

    return (
        <Grid container spacing={3}>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h4">
                                Личный кабинет
                            </Typography>
                            <Button
                                variant="contained"
                                component={Link}
                                to="/apply"
                                size="large"
                            >
                                Подать заявку на кредит
                            </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/edit-profile"
                                sx={{ ml: 2 }}
                            >
                                Редактировать профиль
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Мои кредитные заявки
                        </Typography>

                        {loading ? (
                            <Typography>Загрузка...</Typography>
                        ) : applications.length === 0 ? (
                            <Typography color="text.secondary">
                                У вас пока нет кредитных заявок
                            </Typography>
                        ) : (
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Дата подачи</TableCell>
                                            <TableCell>Сумма</TableCell>
                                            <TableCell>Срок</TableCell>
                                            <TableCell>Статус</TableCell>
                                            <TableCell>Действия</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {applications.map((app) => (
                                            <TableRow key={app.id}>
                                                <TableCell>#{app.id}</TableCell>
                                                <TableCell>
                                                    {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {app.loan_amount ? `${app.loan_amount.toLocaleString()} руб.` : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {app.loan_term ? `${app.loan_term} мес.` : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getStatusText(app.status)}
                                                        color={getStatusColor(app.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        component={Link}
                                                        to={`/status?id=${app.id}`}
                                                        size="small"
                                                    >
                                                        Подробнее
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        <Button
                            onClick={loadMyApplications}
                            variant="outlined"
                            sx={{ mt: 2 }}
                        >
                            Обновить список
                        </Button>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

// import { useState, useEffect } from 'react';
// import {
//     Grid,
//     Card,
//     CardContent,
//     Typography,
//     Button,
//     Box,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import { applicationAPI } from '../../api/creditApi';

// export default function DashboardUser() {
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadApplications();
//     }, []);

//     const loadApplications = async () => {
//         try {
//             const response = await applicationAPI.getAll();
//             setApplications(response.data);
//         } catch (error) {
//             console.error('Ошибка загрузки заявок:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getStatusColor = (status) => {
//         const colors = {
//             'NEW': '#1976d2',
//             'IN_PROGRESS': '#ed6c02',
//             'APPROVED': '#2e7d32',
//             'REJECTED': '#d32f2f'
//         };
//         return colors[status] || '#666';
//     };

//     return (
//         <Grid container spacing={3}>
//             <Grid item xs={12}>
//                 <Card>
//                     <CardContent>
//                         <Box display="flex" justifyContent="space-between" alignItems="center">
//                             <Typography variant="h4">
//                                 Личный кабинет
//                             </Typography>
//                             <Button
//                                 variant="contained"
//                                 component={Link}
//                                 to="/apply"
//                                 size="large"
//                             >
//                                 Подать заявку на кредит
//                             </Button>
//                         </Box>
//                     </CardContent>
//                 </Card>
//             </Grid>

//             <Grid item xs={12}>
//                 <Card>
//                     <CardContent>
//                         <Typography variant="h6" gutterBottom>
//                             История заявок
//                         </Typography>

//                         <TableContainer component={Paper}>
//                             <Table>
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>ID</TableCell>
//                                         <TableCell>Дата подачи</TableCell>
//                                         <TableCell>Сумма</TableCell>
//                                         <TableCell>Срок</TableCell>
//                                         <TableCell>Статус</TableCell>
//                                         <TableCell>Действия</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {applications.map((app) => (
//                                         <TableRow key={app.id}>
//                                             <TableCell>{app.id}</TableCell>
//                                             <TableCell>
//                                                 {new Date(app.creationDate).toLocaleDateString()}
//                                             </TableCell>
//                                             <TableCell>{app.loanAmount?.toLocaleString()} руб.</TableCell>
//                                             <TableCell>{app.loanTerm} мес.</TableCell>
//                                             <TableCell>
//                                                 <Typography
//                                                     color={getStatusColor(app.status)}
//                                                     fontWeight="bold"
//                                                 >
//                                                     {app.status}
//                                                 </Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Button
//                                                     component={Link}
//                                                     to={`/status?id=${app.id}`}
//                                                     size="small"
//                                                 >
//                                                     Подробнее
//                                                 </Button>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </CardContent>
//                 </Card>
//             </Grid>
//         </Grid>
//     );
// }

// import { Link } from "react-router-dom";

// export default function DashboardUser() {
//     return (
//         <div style={{ padding: 20 }}>
//             <h2>Личный кабинет</h2>
//             <Link to="/apply">Подать заявку на кредит</Link><br /><br />
//             <Link to="/status">Статус последней заявки</Link>
//         </div>
//     );
// }

// import React from "react";
// import { getApplications } from "../api/fakeApi";

// export default function DashboardUser() {
//     const applications = getApplications();

//     return (
//         <div>
//             <h2>Личный кабинет</h2>
//             <table border="1" cellPadding="5">
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>ФИО</th>
//                         <th>Сумма</th>
//                         <th>Срок</th>
//                         <th>Статус</th>
//                         <th>Дата</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {applications.map(a => (
//                         <tr key={a.id}>
//                             <td>{a.id}</td>
//                             <td>{a.user}</td>
//                             <td>{a.amount}</td>
//                             <td>{a.term}</td>
//                             <td>{a.status}</td>
//                             <td>{a.date}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
