import { Container } from '@mui/material';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {children}
            </Container>
        </>
    );
}