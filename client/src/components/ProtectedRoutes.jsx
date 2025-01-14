import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector(store => store.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children;
}

export const AdminRoute = ({ children }) => {
    const { user, isAuthenticated } = useSelector(store => store.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    if (user?.role !== "superAdmin") {
        return <Navigate to="/" />
    }

    return children;
}

export const DeactiveUserRoute = ({ component: Component, userStatus }) => {
    if (userStatus === "deactivated") {
        return <Navigate to="/403" />;
    }

    return <Component />;
};

export default DeactiveUserRoute;
