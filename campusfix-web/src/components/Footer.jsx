import React from "react";
import { Link } from "react-router-dom";
import { QrCode, Shield, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="no-print"
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        backgroundColor: "#080A0F",
        padding: "2.5rem 1.25rem 1.5rem 1.25rem",
        color: "#94A3B8"
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2rem"
          }}
        >
          {/* Col 1: System Branding */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "0.375rem",
                  background: "#0284C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <QrCode size={16} color="#ffffff" />
              </div>
              <span style={{ fontSize: "1.125rem", fontWeight: "800", color: "#F8FAFC" }}>
                CampusFix
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#64748B" }}>
              QR-Based Campus Asset & Issue Management System. Fast, transparent maintenance workflows for college facilities and equipment.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
              <li>
                <Link to="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Portal Home</Link>
              </li>
              <li>
                <Link to="/track" style={{ color: "#94A3B8", textDecoration: "none" }}>Track Raised Ticket</Link>
              </li>
              <li>
                <Link to="/admin/login" style={{ color: "#94A3B8", textDecoration: "none" }}>Admin Portal Login</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Technology Highlights */}
          <div>
            <h4 style={{ fontSize: "0.875rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Technology Stack
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {["React 19 + Vite", "Firebase Firestore", "OpenStreetMap", "Leaflet", "Flutter (Mobile)", "QR Code"].map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.25rem",
                    background: "#131722",
                    color: "#94A3B8",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.75rem",
            color: "#64748B"
          }}
        >
          <div>
            © {new Date().getFullYear()} CampusFix — College Maintenance Management System.
          </div>
          <div>
            Smart Campus Facility Operations
          </div>
        </div>
      </div>
    </footer>
  );
};
