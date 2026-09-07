import React, { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "sx_session_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.sessionStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(({ email, role, name, ...rest } = {}) => {
    const defaultName =
      role === "University"
        ? "Dr. Savita Ramanathan"
        : role === "Industry"
        ? "AetherGrid Technologies"
        : "Anvita Chaudhary";

    const sessionUser = {
      email: email || `${(role || "citizen").toLowerCase()}@digisahay.gov.in`,
      role: role || "Citizen",
      name: name || defaultName,
      ...rest,
    };

    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    } catch (e) {
      console.warn("Could not save auth session", e);
    }

    if (rest.token) {
      localStorage.setItem("token", rest.token);
    }

    setUser(sessionUser);
  }, []);

  const logout = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {
      console.warn("Could not clear auth session", e);
    }
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}