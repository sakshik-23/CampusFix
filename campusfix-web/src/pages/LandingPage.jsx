import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  QrCode, 
  Search, 
  ArrowRight, 
  MapPin, 
  Smartphone, 
  Wrench, 
  CheckCircle2,
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
    itemName: "Ceiling Projector",
    room: "A-203",
    building: "Main Academic Block"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "4rem 1.25rem 3rem 1.25rem",
          overflow: "hidden"
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "center" }}>
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.65rem",
                borderRadius: "9999px",
                background: "rgba(2, 132, 199, 0.1)",
                border: "1px solid rgba(2, 132, 199, 0.25)",
                color: "#38BDF8",
                fontSize: "0.75rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "600",
                marginBottom: "1.25rem"
              }}
            >
              <QrCode size={13} /> CAMPUS FACILITY MANAGEMENT
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                fontWeight: "800",
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#FFFFFF",
                marginBottom: "1rem"
              }}
            >
              Campus Asset & Issue Tracking
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "#94A3B8",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
                maxWidth: "520px"
              }}
            >
              Scan physical QR labels on campus equipment to report maintenance issues instantly. Technicians track, inspect, and resolve tickets with real-time GPS verification.
            </p>

            {/* Clean Search / Lookup Bar */}
            <form
              onSubmit={handleSimulateScan}
              style={{
                background: "#0E121B",
                padding: "0.35rem",
                borderRadius: "0.5rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                maxWidth: "480px",
                marginBottom: "1rem"
              }}
            >
              <div style={{ paddingLeft: "0.75rem", color: "#64748B" }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Enter Asset ID (e.g. AST-000001) or Ticket ID..."
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
                style={{ padding: "0.45rem 0.9rem", fontSize: "0.8125rem" }}
              >
                Look Up <ArrowRight size={14} />
              </button>
            </form>

            {/* Sample Asset Links */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.75rem", color: "#64748B" }}>
              <span>Sample Equipment:</span>
              {assets.slice(0, 3).map((a) => (
                <button
                  key={a.itemId}
                  onClick={() => navigate(`/report/${a.itemId}`)}
                  style={{
                    background: "#131722",
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

          {/* Right Hero: Clean Industrial Asset QR Tag */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "320px",
                background: "#FFFFFF",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                color: "#0F172A",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.6)",
                border: "1px solid #CBD5E1",
                textAlign: "center",
                userSelect: "none"
              }}
            >
              {/* Asset Tag Header */}
              <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", fontWeight: "700", color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                CAMPUS PROPERTY ID
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", marginTop: "0.15rem" }}>
                {sampleFeaturedAsset.itemName}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#475569", fontWeight: "600", marginTop: "2px" }}>
                Room {sampleFeaturedAsset.room} • {sampleFeaturedAsset.building}
              </div>

              {/* QR Code */}
              <div
                style={{
                  display: "inline-block",
                  margin: "1rem auto 0.75rem auto",
                  padding: "0.75rem",
                  background: "#F8FAFC",
                  borderRadius: "0.5rem",
                  border: "1px solid #E2E8F0"
                }}
              >
                <QRCodeSVG
                  value={`${window.location.origin}/report/${sampleFeaturedAsset.itemId}`}
                  size={150}
                  level="H"
                  includeMargin={false}
                />
              </div>

              {/* Asset ID */}
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: "800", fontSize: "1rem", color: "#0F172A" }}>
                {sampleFeaturedAsset.itemId}
              </div>
              <div style={{ fontSize: "0.725rem", color: "#64748B", marginTop: "2px" }}>
                Scan with camera to report maintenance issue
              </div>

              <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.65rem", color: "#94A3B8", fontFamily: "var(--font-mono)" }}>VERIFIED ASSET</span>
                <button
                  onClick={() => navigate(`/report/${sampleFeaturedAsset.itemId}`)}
                  style={{
                    background: "#0284C7",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "0.3rem",
                    padding: "0.25rem 0.6rem",
                    fontSize: "0.725rem",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 3rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Assets</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#FFFFFF", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.totalAssets}</div>
            <div style={{ fontSize: "0.75rem", color: "#38BDF8", marginTop: "0.25rem" }}>Registered with QR labels</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Issues</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#F87171", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.openTickets}</div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.25rem" }}>Pending technician action</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resolved</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#34D399", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>{stats.closedTickets}</div>
            <div style={{ fontSize: "0.75rem", color: "#34D399", marginTop: "0.25rem" }}>Completed and verified</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em" }}>Operational Rate</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#CBD5E1", marginTop: "0.15rem", letterSpacing: "-0.03em" }}>
              {stats.totalAssets > 0 ? `${Math.round(((stats.totalAssets - stats.openTickets) / stats.totalAssets) * 100)}%` : "100%"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.25rem" }}>Equipment in working condition</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 3.5rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            HOW IT WORKS
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.2rem" }}>
            Three-Step Resolution Process
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          <div className="card-premium" style={{ padding: "1.5rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(2, 132, 199, 0.1)", color: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <QrCode size={18} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>STEP 01</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#FFFFFF", margin: "0.3rem 0 0.4rem 0" }}>Scan Equipment QR</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Scan the physical QR sticker on any device using any phone camera to open the asset filing page directly.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.5rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(168, 85, 247, 0.1)", color: "#C084FC", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Smartphone size={18} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>STEP 02</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#FFFFFF", margin: "0.3rem 0 0.4rem 0" }}>Submit Issue Details</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Select defect category, describe the issue, and provide your phone number. The ticket is immediately routed to technicians.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.5rem" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "0.5rem", background: "rgba(16, 185, 129, 0.1)", color: "#34D399", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Wrench size={18} />
            </div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", fontWeight: "600" }}>STEP 03</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#FFFFFF", margin: "0.3rem 0 0.4rem 0" }}>On-Site Resolution</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Maintenance staff inspect the asset, perform repairs, record resolution remarks, and close the ticket with GPS confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 4rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
              CAMPUS ASSET MAP
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.2rem" }}>
              Equipment Locations & Maintenance Status
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#34D399" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }}></span> Operational
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#F87171" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444" }}></span> Issue Reported
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
