import React from "react";
import { QrCode } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      className="no-print"
      style={{
        borderTop: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        padding: "2.5rem 1.25rem 1.5rem 1.25rem",
        color: "#64748B"
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          {/* System Branding */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
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
              <span style={{ fontSize: "1.125rem", fontWeight: "800", color: "#0F172A" }}>
                CampusFix
              </span>
            </div>
            <p style={{ fontSize: "0.825rem", lineHeight: 1.5, color: "#64748B", margin: 0, maxWidth: "540px" }}>
              QR-Based Campus Asset & Issue Maintenance System. Fast, transparent maintenance workflows for college facilities and equipment.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #E2E8F0",
            paddingTop: "1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.775rem",
            color: "#64748B"
          }}
        >
          <div>
            © {new Date().getFullYear()} CampusFix — Campus Asset & Issue Maintenance.
          </div>
          <div>
            Smart Campus Facility Operations
          </div>
        </div>
      </div>
    </footer>
  );
};
