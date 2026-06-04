import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if(loading) {
        return <div className="min-h-screen bg-[#0f172a] text-state-400 flex items-center justify-center">Loading...</div>;
    }

    if(!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;