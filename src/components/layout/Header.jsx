import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole'); // 👈 ВЕРНУЛ

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Кредитный конвейер
                </Typography>

                <Box>
                    {/* 🔥 Блок для АДМИНА / СУПЕР-АДМИНА */}
                    {isAuthenticated && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') && (
                        <>
                            {/* <Button color="inherit" onClick={() => navigate('/admin/applications')}>
                                Все заявки
                            </Button> */}

                            <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
                                Статистика
                            </Button>
                        </>
                    )}

                    {/* 🔥 Блок только для СУПЕР-АДМИНА */}
                    {/* {isAuthenticated && userRole === 'SUPER_ADMIN' && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/super-admin')}>
                                Панель супер-админа
                            </Button>
                        </>
                    )} */}

                    {/* Кнопки входа/выхода */}
                    {isAuthenticated ? (
                        <Button color="inherit" onClick={handleLogout}>
                            Выйти
                        </Button>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Войти
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Регистрация
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
