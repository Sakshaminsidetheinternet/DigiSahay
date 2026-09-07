import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenAuth from "./pages/CitizenAuth";
import UnivAuth from "./pages/UnivAuth";
import UniversityDashboard from "./pages/UniversityDashboard";
import IndustryDashboard from "./pages/IndustryDashboard";
import IndustryAuth from "./pages/IndustryAuth";
import { palette, font } from "./styles/tokens";
import "./styles/App.css";

const rootStyle = {
  "--sx-cream": palette.cream,
  "--sx-section-gray": palette.sectionGray,
  "--sx-white": palette.white,
  "--sx-ink": palette.ink,
  "--sx-maroon": palette.maroon,
  "--sx-gold": palette.gold,
  "--sx-icon-bg": palette.iconBg,
  "--sx-muted": palette.muted,
  "--sx-border": palette.border,
  "--sx-border-strong": palette.borderStrong,
  "--sx-serif": font.serif,
  "--sx-sans": font.sans,
  background: palette.cream,
  color: palette.ink,
  fontFamily: font.sans,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="sx-page-transition">
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/citizen-auth" element={<CitizenAuth />} />
        <Route path="/university-auth" element={<UnivAuth />} />
        <Route path="/industry-auth" element={<IndustryAuth />} />
        <Route path="/Industry-auth" element={<IndustryAuth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute fallbackRole="Citizen">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/citizen"
          element={
            <ProtectedRoute fallbackRole="Citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute fallbackRole="Citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute fallbackRole="Citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/university"
          element={
            <ProtectedRoute fallbackRole="University">
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/university-dashboard"
          element={
            <ProtectedRoute fallbackRole="University">
              <UniversityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/industry"
          element={
            <ProtectedRoute fallbackRole="Industry">
              <IndustryDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/industry-dashboard"
          element={
            <ProtectedRoute fallbackRole="Industry">
              <IndustryDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <div className="sx-app" style={rootStyle}>
      <LanguageProvider>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}
