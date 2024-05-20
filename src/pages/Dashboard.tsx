import { NavbarSimple } from '../components/NavbarSimple/NavbarSimple.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TableSelection } from '../components/TableSelection/TableSelection.tsx';

export function Dashboard() {
    const {isAuthenticated, isLoading} = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    return (
        <div style={{display: 'flex'}}>
            <NavbarSimple/>
            <div style={{flex: '1 0 auto'}}>
                <TableSelection />
            </div>
        </div>
    )
}