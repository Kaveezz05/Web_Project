import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // ✅ Import the custom hook

const ProtectedRoute = ({ children, allow }) => {
  const { user } = useAuth();

  // 🚫 Not logged in → redirect to home/login
  if (!user) return <Navigate to="/" replace />;

  // 🔒 Logged in but not allowed (e.g. not admin/cashier)
  const username = user.username.toLowerCase();
  if (allow && !allow.includes(username)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed → show content
  return children;
};

export default ProtectedRoute;
