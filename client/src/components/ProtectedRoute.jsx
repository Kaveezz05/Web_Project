import React from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth"; // ✅ Import the custom hook

const ProtectedRoute = ({ children, allow }) => {
  const { user } = useAuth();

  // 🚫 Not logged in → show toast + redirect
  if (!user) {
    toast.error("Please log in first");
    return <Navigate to="/" replace />;
  }
  

  // 🔒 Logged in but not allowed (role check)
  const username = user.username?.toLowerCase();
  if (allow && !allow.includes(username)) {
    toast.error("Access denied");
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed → show content
  return children;
};

export default ProtectedRoute;
