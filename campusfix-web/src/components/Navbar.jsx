import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { QrCode, Shield, Search, LogOut, ArrowRight, Activity } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { stats } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <header
      className="panel-base"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem"
        }}
      >
        {/* Brand Logo & Tagline */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            textDecoration: "none",
            color: "inherit"
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 14px rgba(2, 132, 199, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)"
            }}
          >
            <QrCode size={18} color="#ffffff" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "700", letterSpacing: "-0.03em", color: "#F8FAFC", lineHeight: 1.1 }}>
              CampusFix
            </span>
            <span style={{ fontSize: "0.675rem", color: "#64748B", letterSpacing: "0.02em" }}>
              Asset & Issue Management
            </span>
          </div>
        </Link>

        {/* Center Live Pill Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="no-print">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#0E1117",
              padding: "0.3rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.07)",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)"
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#94A3B8" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: stats.openTickets > 0 ? "#EF4444" : "#10B981" }}></span>
              Open: <strong style={{ color: stats.openTickets > 0 ? "#F87171" : "#34D399" }}>{stats.openTickets}</strong>
            </span>
            <span style={{ color: "rgba(255, 255, 255, 0.1)" }}>•</span>
            <span style={{ color: "#94A3B8" }}>
              Assets: <strong style={{ color: "#F1F5F9" }}>{stats.totalAssets}</strong>
            </span>
          </div>

          <Link
            to="/track"
            style={{
              color: "#94A3B8",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.65rem",
              borderRadius: "0.375rem",
              transition: "all 0.15s ease"
            }}
            className="btn-ghost"
          >
            <Search size={13} /> Track Ticket
          </Link>
        </div>

        {/* Right Admin Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="no-print">
          {isAdmin ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Link
                to="/admin/dashboard"
                className={isAdminRoute ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
              >
                <Shield size={14} /> Admin Portal
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-ghost"
                style={{ color: "#F87171", padding: "0.35rem 0.5rem" }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="btn-secondary"
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.8rem" }}
            >
              <Shield size={14} /> Admin Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
