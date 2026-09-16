import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";
import useRole from "../hook/useRole";
import AccessDenied from "../pages/AccessDenied/AccessDenied";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedRoute;