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
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 58px)",
        padding: "1.25rem 0.75rem",
        flexShrink: 0
      }}
    >
      {/* Admin Session Badge */}
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: "0.5rem",
          padding: "0.65rem 0.85rem",
          marginBottom: "1.25rem",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          gap: "0.45rem"
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "#10B981"
          }}
        />
        <span style={{ fontSize: "0.7rem", color: "#475569", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.06em" }}>
          Active Admin Session
        </span>
      </div>

      {/* Main Navigation Links */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1 }}>
        <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", padding: "0.25rem 0.5rem", letterSpacing: "0.08em" }}>
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
                padding: "0.55rem 0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: active ? "600" : "500",
                color: active ? "#0284C7" : "#475569",
                backgroundColor: active ? "#F0F9FF" : "transparent",
                border: active ? "1px solid #BAE6FD" : "1px solid transparent",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: active ? "#0284C7" : "#64748B" }}>{link.icon}</span>
                <span>{link.title}</span>
              </div>
              {link.badge && (
                <span
                  style={{
                    fontSize: "0.675rem",
                    padding: "0.1rem 0.45rem",
                    borderRadius: "9999px",
                    fontWeight: "700",
                    background: link.badgeColor ? "#FEF2F2" : "#F1F5F9",
                    color: link.badgeColor ? "#DC2626" : "#475569",
                    border: link.badgeColor ? "1px solid #FCA5A5" : "1px solid #E2E8F0"
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
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", borderTop: "1px solid #E2E8F0", paddingTop: "0.85rem" }}>
        <button
          onClick={() => {
            if (window.confirm("Reset all assets and tickets back to initial dataset?")) {
              resetToSeedData();
            }
          }}
          className="btn-ghost"
          style={{ width: "100%", fontSize: "0.775rem", padding: "0.4rem 0.6rem", justifyContent: "flex-start", color: "#64748B" }}
        >
          <RotateCcw size={14} /> Reset Demo Data
        </button>

        <Link
          to="/"
          className="btn-ghost"
          style={{ width: "100%", fontSize: "0.775rem", padding: "0.4rem 0.6rem", justifyContent: "flex-start", color: "#64748B" }}
        >
          <ExternalLink size={14} /> Public Portal
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
            fontSize: "0.8rem",
            fontWeight: "600",
            padding: "0.45rem 0.6rem",
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
