import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = "/authentication" 
}: ProtectedRouteProps) {
  const { isAuthenticated,user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication status
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location the user was trying to access
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (isAuthenticated && user?.hasCompletedWizard === false) {
    return <Navigate to="/form" />;
  }

  return <>{children}</>;
}