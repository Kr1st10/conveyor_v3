import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Tabs, Tab } from '@mui/material';
import { adminAPI } from '../../api/realApi';

function TabPanel({ children, value, index }) {
    return value === index ? <Box sx={{ mt: 2 }}>{children}</Box> : null;
}

export default function RealAdminPanel() {
    const [tabValue, setTabValue] = useState(0);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadAllApplications = async () => {
        try {
            const response = await adminAPI.getAllApplications();
            const applications = response.data?.items || response.data || [];
            console.log("ALL APPLICATIONS", applications); // <- добавь сюда
            setAllApplications(applications);
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить заявки');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllApplications();
    }, []);

    if (loading) return <Typography>Загрузка данных...</Typography>;

    // Статистика
    const total = allApplications.length;
    const approvedCount = allApplications.filter(a => a.status.toLowerCase() === 'approved').length;
    const rejectedCount = allApplications.filter(a => a.status.toLowerCase() === 'rejected').length;


    return (
        <Box>
            <Typography variant="h4" gutterBottom>Админ панель</Typography>

            <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
                <Tab label="Все заявки" />
                <Tab label="Статистика" />
            </Tabs>

            {/* Вкладка Заявки */}
            <TabPanel value={tabValue} index={0}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                {/* <TableCell>Имя</TableCell>
                                <TableCell>Email</TableCell> */}
                                <TableCell>Сумма</TableCell>
                                <TableCell>Статус</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allApplications.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>{app.id}</TableCell>
                                    <TableCell>{app.loan_amount}</TableCell>
                                    <TableCell>{app.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </TabPanel>

            {/* Вкладка Статистика */}
            <TabPanel value={tabValue} index={1}>
                <Typography>Одобрено: {approvedCount}</Typography>
                <Typography>Отказано: {rejectedCount}</Typography>
                <Typography>Всего заявок: {total}</Typography>
            </TabPanel>
        </Box>
    );
}
