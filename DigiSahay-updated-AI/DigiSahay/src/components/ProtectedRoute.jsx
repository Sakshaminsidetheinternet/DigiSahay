import React, { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, fallbackRole = "Citizen" }) {
  const { user, login } = useAuth();

  const sessionUser = useMemo(() => {
    if (user) return user;
    try {
      const stored = window.sessionStorage?.getItem("sx_session_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, [user]);

  useEffect(() => {
    if (!sessionUser) {
      login({ role: fallbackRole });
    }
  }, [sessionUser, login, fallbackRole]);

  return children;
}
