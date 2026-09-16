import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  QrCode, 
  Search, 
  ArrowRight, 
  MapPin, 
  Smartphone, 
  Wrench, 
  ShieldCheck,
  Zap,
  Check,
  Layers,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useData } from "../context/DataContext";
import { CampusMap } from "../components/CampusMap";
import { StatusBadge } from "../components/StatusBadge";

export const LandingPage = () => {
  const { assets, tickets, stats } = useData();
  const [searchCode, setSearchCode] = useState("");
  const navigate = useNavigate();

  const handleSimulateScan = (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const clean = searchCode.trim().toUpperCase();
    if (clean.startsWith("TKT-")) {
      navigate(`/ticket/${clean}`);
    } else {
      navigate(`/report/${clean}`);
    }
  };

  const sampleFeaturedAsset = assets[0] || {
    itemId: "AST-000001",
    itemName: "Projector #01",
    room: "A-203",
    building: "Main Academic Block"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "4.5rem 1.25rem 3.5rem 1.25rem",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3.5rem", alignItems: "center" }}>
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                color: "#38BDF8",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "600",
                marginBottom: "1.5rem"
              }}
            >
              <Zap size={13} /> QR-BASED CAMPUS ASSET TELEMETRY
            </div>

            <h1
              style={{
                fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                fontWeight: "800",
                lineHeight: 1.12,
                letterSpacing: "-0.035em",
                color: "#FFFFFF",
                marginBottom: "1.25rem"
              }}
            >
              Scan. Report. Resolve.<br />
              <span style={{ color: "#94A3B8", fontWeight: "600" }}>
                Campus maintenance made effortless.
              </span>
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#94A3B8",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: "540px"
              }}
            >
              Every projector, air conditioner, and smart device is assigned a high-contrast physical QR label. When an issue occurs, any student or faculty can file a ticket in seconds without creating an account.
            </p>

            {/* Quick Interactive Command Bar */}
            <form
              onSubmit={handleSimulateScan}
              style={{
                background: "#0E1117",
                padding: "0.4rem",
                borderRadius: "0.625rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.6)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                maxWidth: "500px",
                marginBottom: "1.25rem"
              }}
            >
              <div style={{ paddingLeft: "0.75rem", color: "#64748B" }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Simulate Scan (e.g. AST-000001) or Ticket ID"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "0.875rem",
                  outline: "none",
                  fontFamily: "var(--font-mono)"
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "0.5rem 1rem", fontSize: "0.8125rem" }}
              >
                Scan <ArrowRight size={14} />
              </button>
            </form>

            {/* Quick Demo Tags */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.75rem", color: "#64748B" }}>
              <span>Quick Demos:</span>
              {assets.slice(0, 3).map((a) => (
                <button
                  key={a.itemId}
                  onClick={() => navigate(`/report/${a.itemId}`)}
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "#94A3B8",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "0.3rem",
                    fontSize: "0.725rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#38BDF8";
                    e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#94A3B8";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  }}
                >
                  {a.itemId} ({a.itemName})
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero: Luxury Acrylic Physical QR Sticker Mockup with Laser Sweep */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "340px",
                background: "linear-gradient(145deg, #FFFFFF 0%, #F1F5F9 100%)",
                borderRadius: "1rem",
                padding: "1.75rem 1.25rem",
                color: "#0F172A",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.15)",
                border: "2px solid #E2E8F0",
                position: "relative",
                textAlign: "center",
                userSelect: "none"
              }}
            >
              {/* Corner Bolt Details for realistic physical hardware label */}
              <div style={{ position: "absolute", top: "10px", left: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", border: "1px solid #94A3B8" }}></div>
              <div style={{ position: "absolute", top: "10px", right: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", border: "1px solid #94A3B8" }}></div>
              <div style={{ position: "absolute", bottom: "10px", left: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", border: "1px solid #94A3B8" }}></div>
              <div style={{ position: "absolute", bottom: "10px", right: "10px", width: "6px", height: "6px", borderRadius: "50%", background: "#CBD5E1", border: "1px solid #94A3B8" }}></div>

              {/* Tag Header */}
              <div style={{ fontSize: "1.1rem", fontWeight: "800", letterSpacing: "0.02em", color: "#0F172A", textTransform: "uppercase" }}>
                {sampleFeaturedAsset.itemName}
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748B", marginTop: "2px" }}>
                ROOM: {sampleFeaturedAsset.room} • {sampleFeaturedAsset.building}
              </div>

              {/* QR Container with Laser Line */}
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  margin: "1rem auto 0.75rem auto",
                  padding: "0.75rem",
                  background: "#FFFFFF",
                  borderRadius: "0.5rem",
                  border: "1px solid #E2E8F0",
                  overflow: "hidden"
                }}
              >
                <QRCodeSVG
                  value={`${window.location.origin}/report/${sampleFeaturedAsset.itemId}`}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
                <div className="laser-line"></div>
              </div>

              {/* Warning/Prompt */}
              <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#DC2626", letterSpacing: "0.03em", lineHeight: 1.3 }}>
                IF BROKEN SCAN THIS QR<br />AND RAISE A TICKET
              </div>

              {/* Asset ID */}
              <div style={{ marginTop: "0.4rem", fontFamily: "var(--font-mono)", fontWeight: "800", fontSize: "1rem", color: "#0F172A" }}>
                {sampleFeaturedAsset.itemId}
              </div>

              <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed #CBD5E1", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", color: "#94A3B8", fontFamily: "var(--font-mono)" }}>CAMPUS PHYSICAL ASSET</span>
                <button
                  onClick={() => navigate(`/report/${sampleFeaturedAsset.itemId}`)}
                  style={{
                    background: "#0284C7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.2rem 0.5rem",
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Test Scan →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Strip (Clean Minimalist Numbers) */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 3.5rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Assets</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#FFFFFF", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.totalAssets}</div>
            <div style={{ fontSize: "0.75rem", color: "#38BDF8", marginTop: "0.25rem" }}>Tagged with QR identity</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Issues</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#F87171", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.openTickets}</div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.25rem" }}>Pending technician action</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resolved</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#34D399", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.closedTickets}</div>
            <div style={{ fontSize: "0.75rem", color: "#34D399", marginTop: "0.25rem" }}>Verified & Closed</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Map Telemetry</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#C084FC", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>100%</div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.25rem" }}>OpenStreetMap GPS synced</div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / How it Works (Refined Minimalist Design) */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 4rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            SYSTEM WORKFLOW
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.25rem" }}>
            How CampusFix Works
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          <div className="card-premium" style={{ padding: "1.75rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <QrCode size={20} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>01 • SCAN</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#FFFFFF", margin: "0.35rem 0 0.5rem 0" }}>Camera QR Detection</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Point any mobile camera at the asset sticker. Instantly opens the public reporting interface tied to the physical asset ID.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.75rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(168, 85, 247, 0.1)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Smartphone size={20} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>02 • REPORT</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#FFFFFF", margin: "0.35rem 0 0.5rem 0" }}>One-Step Ticket Filing</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Select issue category, provide description and contact phone. The system freezes asset coordinates and generates an immutable ticket.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.75rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(52, 211, 153, 0.1)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Wrench size={20} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>03 • RESOLVE</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#FFFFFF", margin: "0.35rem 0 0.5rem 0" }}>On-Site Technician Close</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Administrators view map coordinates, inspect the asset, record resolution remarks, and update status to Resolved (🟢 CLOSED).
            </p>
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 4rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
              CAMPUS TELEMETRY
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.25rem" }}>
              Interactive Asset & Issue Geo-Map
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#34D399" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></span> Nominal
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#F87171" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span> Open Defect
            </span>
          </div>
        </div>

        <div className="card-premium" style={{ padding: "0.4rem" }}>
          <CampusMap assets={assets} tickets={tickets} height="400px" />
        </div>
      </section>
    </div>
  );
};
