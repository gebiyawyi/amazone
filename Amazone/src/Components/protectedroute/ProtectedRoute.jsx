import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../pages/Auth/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate to="/signup" state={{ from: location.pathname }} replace />
    );
  }

  return children;
}

export default ProtectedRoute;
