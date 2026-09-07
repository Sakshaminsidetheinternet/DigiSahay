import React from "react";
import { Link, Navigate } from "react-router-dom";
import { DASHBOARD_CONTENT } from "../data/content";
import { DiamondMark, FolderIcon, ClockIcon, CheckCircleIcon, LogoutIcon } from "../components/icons";
import { useAuth } from "../context/AuthContext";

const CARD_ICONS = {
  folder: FolderIcon,
  clock: ClockIcon,
  check: CheckCircleIcon,
};

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (user?.role === "Citizen") {
    return <Navigate to="/dashboard/citizen" replace />;
  }

  if (user?.role === "University") {
    return <Navigate to="/dashboard/university" replace />;
  }

  if (user?.role === "Industry") {
    return <Navigate to="/dashboard/industry" replace />;
  }

  return (
    <div className="sx-dash">
      <header className="sx-dash-header">
        <div className="sx-wrap sx-dash-header-inner">
          <Link to="/" className="sx-auth-brand" aria-label="DigiSahay Home">
            <div className="sx-logo-mark sx-logo-sm">
              <DiamondMark />
            </div>
            <span>DigiSahay</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to="/login" className="sx-portal-back" style={{ fontSize: "12px", textDecoration: "none" }}>
              Switch Dashboard ↗
            </Link>
            <button className="sx-dash-logout" onClick={logout}>
              <LogoutIcon />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="sx-wrap sx-dash-main">
        <p className="sx-kicker">{DASHBOARD_CONTENT.kicker}</p>
        <h1 className="sx-dash-heading">
          {DASHBOARD_CONTENT.greeting}
          {user?.role ? `, ${user.role}` : user?.email ? `, ${user.email}` : ""}
        </h1>

        <div className="sx-dash-cards">
          {DASHBOARD_CONTENT.cards.map((card) => {
            const Icon = CARD_ICONS[card.icon];
            return (
              <div className="sx-dash-card" key={card.label}>
                <div className="sx-step-icon">
                  <Icon />
                </div>
                <p className="sx-stat-label">{card.label}</p>
                <p className="sx-stat-figure">{card.figure}</p>
                <p className="sx-stat-unit">{card.unit}</p>
              </div>
            );
          })}
        </div>

        <section className="sx-dash-activity">
          <h2>Recent activity</h2>
          <ul>
            {DASHBOARD_CONTENT.activity.map((item) => (
              <li key={item.title}>
                <p className="sx-dash-activity-title">{item.title}</p>
                <p className="sx-dash-activity-meta">{item.meta}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
