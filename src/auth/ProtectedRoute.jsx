import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("auth") === "true";
  return isAuth ? children : <Navigate to="/auth/register" replace />;
  return isAuth? children : <Navigate to="/auth/login" replace />;
}