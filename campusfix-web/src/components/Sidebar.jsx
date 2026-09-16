import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Box, 
  PlusCircle, 
  Ticket, 
  Printer, 
  LogOut, 
  RotateCcw,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { stats, resetToSeedData } = useData();

  const isActive = (path) => location.pathname === path;
  const isStartsWith = (path) => location.pathname.startsWith(path);

  const navLinks = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={16} />
    },
    {
      title: "Assets Inventory",
      path: "/admin/assets",
      icon: <Box size={16} />,
      badge: stats.totalAssets
    },
    {
      title: "Register Asset",
      path: "/admin/assets/new",
      icon: <PlusCircle size={16} />
    },
    {
      title: "QR Print Studio",
      path: "/admin/print-qr",
      icon: <Printer size={16} />
    },
    {
      title: "Maintenance Tickets",
      path: "/admin/tickets",
      icon: <Ticket size={16} />,
      badge: stats.openTickets > 0 ? `${stats.openTickets}` : null,
      badgeColor: "#EF4444"
    }
  ];

  return (
    <aside
      className="no-print"
      style={{
        width: "240px",
        backgroundColor: "#0B0D13",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 58px)",
        padding: "1rem 0.65rem",
        flexShrink: 0
      }}
    >
      {/* Admin Profile Mini Card */}
      <div
        style={{
          background: "#11141D",
          borderRadius: "0.5rem",
          padding: "0.65rem 0.75rem",
          marginBottom: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.05)"
        }}
      >
        <div style={{ fontSize: "0.65rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.06em" }}>
          Active Admin Session
        </div>
        <div style={{ fontWeight: "600", color: "#F8FAFC", fontSize: "0.825rem", marginTop: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.name || "Campus Admin"}
        </div>
        <div style={{ fontSize: "0.725rem", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-mono)" }}>
          {user?.email || "admin@campusfix.edu"}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
        <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#475569", textTransform: "uppercase", padding: "0.25rem 0.5rem", letterSpacing: "0.08em" }}>
          Operations
        </div>
        {navLinks.map((link) => {
          const active = isActive(link.path) || (link.path !== "/admin/dashboard" && isStartsWith(link.path) && link.path !== "/admin/assets/new");
          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.65rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
                fontSize: "0.825rem",
                fontWeight: active ? "600" : "400",
                color: active ? "#FFFFFF" : "#94A3B8",
                backgroundColor: active ? "#171B26" : "transparent",
                border: active ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid transparent",
                transition: "all 0.1s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: active ? "#38BDF8" : "#64748B" }}>{link.icon}</span>
                <span>{link.title}</span>
              </div>
              {link.badge && (
                <span
                  style={{
                    fontSize: "0.675rem",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "9999px",
                    fontWeight: "700",
                    fontFamily: "var(--font-mono)",
                    background: link.badgeColor ? "rgba(239, 68, 68, 0.15)" : "#1E2330",
                    color: link.badgeColor ? "#F87171" : "#94A3B8",
                    border: link.badgeColor ? "1px solid rgba(239, 68, 68, 0.25)" : "none"
                  }}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Utilities in Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem" }}>
        <button
          onClick={() => {
            if (window.confirm("Reset all assets and tickets back to initial dataset?")) {
              resetToSeedData();
            }
          }}
          className="btn-ghost"
          style={{ width: "100%", fontSize: "0.75rem", padding: "0.35rem 0.5rem", justifyContent: "flex-start", color: "#64748B" }}
        >
          <RotateCcw size={13} /> Reset Demo Data
        </button>

        <Link
          to="/"
          className="btn-ghost"
          style={{ width: "100%", fontSize: "0.75rem", padding: "0.35rem 0.5rem", justifyContent: "flex-start", color: "#64748B" }}
        >
          <ExternalLink size={13} /> Public Portal
        </Link>

        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "transparent",
            border: "none",
            color: "#EF4444",
            fontSize: "0.775rem",
            fontWeight: "600",
            padding: "0.4rem 0.5rem",
            cursor: "pointer",
            borderRadius: "0.375rem",
            textAlign: "left",
            marginTop: "0.25rem"
          }}
        >
          <LogOut size={14} /> End Session
        </button>
      </div>
    </aside>
  );
};
