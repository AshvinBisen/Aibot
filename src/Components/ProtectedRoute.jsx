import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ✅ Jab tak localStorage check ho raha hai → loading dikhana
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
