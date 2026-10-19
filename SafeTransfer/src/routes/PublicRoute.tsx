import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Spinner} from "@/components/ui/spinner.tsx";

export function PublicRoute() {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return (
            <div className="grid place-content-center">
                <Spinner/>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/files" replace/>;
    }

    return <Outlet/>;
}
