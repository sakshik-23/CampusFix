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
  AlertTriangle,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useData } from "../context/DataContext";
import { CampusMap } from "../components/CampusMap";

export const LandingPage = () => {
  const { assets, tickets, stats } = useData();
  const [searchCode, setSearchCode] = useState("");
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  const handleSimulateScan = (e) => {
    e.preventDefault();
    setSearchError("");
    const raw = searchCode.trim();
    if (!raw) return;

    const clean = raw.toUpperCase();

    // Reject any Asset ID input from anonymous users
    if (clean.startsWith("AST-") || clean.startsWith("AST") || /^AST/i.test(raw)) {
      setSearchError(
        "Asset IDs are reserved for administrators. Anonymous users cannot look up Asset IDs. To track an issue, please enter your Ticket Number (e.g. TKT-2026-000001). To report a defect, scan the physical QR sticker affixed to the equipment."
      );
      return;
    }

    // Accept only Ticket Number (e.g. TKT-2026-000001 or 2026-000001)
    if (clean.startsWith("TKT-")) {
      navigate(`/ticket/${clean}`);
      return;
    }

    if (/^20\d{2}-\d{5,6}$/.test(clean)) {
      navigate(`/ticket/TKT-${clean}`);
      return;
    }

    setSearchError(
      "Invalid format. Please enter a valid Ticket Number (e.g. TKT-2026-000001). Asset IDs cannot be accepted."
    );
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
          padding: "3.5rem 1.25rem 2.5rem 1.25rem",
          background: "linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)",
          borderBottom: "1px solid #E2E8F0"
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
          {/* Left Hero Content */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "9999px",
                background: "#E0F2FE",
                border: "1px solid #BAE6FD",
                color: "#0369A1",
                fontSize: "0.75rem",
                fontWeight: "600",
                marginBottom: "1rem"
              }}
            >
              <QrCode size={14} /> Campus Asset & Issue Maintenance
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 3.8vw, 3.2rem)",
                fontWeight: "800",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
                color: "#0F172A",
                marginBottom: "0.85rem"
              }}
            >
              Report & Track Campus Facilities Simply
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "1.75rem",
                maxWidth: "520px"
              }}
            >
              Spot a broken projector, fan, or lab PC? Scan the physical QR sticker to log an issue instantly. Technicians track, repair, and close requests with ease.
            </p>

            {/* Clean & Clear Ticket Lookup Bar */}
            <form
              onSubmit={handleSimulateScan}
              style={{
                background: "#FFFFFF",
                padding: "0.45rem 0.5rem",
                borderRadius: "0.75rem",
                border: searchError ? "1.5px solid #FCA5A5" : "1.5px solid #CBD5E1",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                maxWidth: "560px",
                marginBottom: "0.6rem"
              }}
            >
              <div style={{ paddingLeft: "0.75rem", color: "#0284C7", display: "flex", alignItems: "center" }}>
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Enter Ticket Number (e.g. TKT-2026-000001)..."
                value={searchCode}
                onChange={(e) => {
                  setSearchCode(e.target.value);
                  if (searchError) setSearchError("");
                }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#0F172A",
                  fontSize: "0.95rem",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  minWidth: 0
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: "0.55rem 1.15rem", fontSize: "0.875rem", flexShrink: 0 }}
              >
                Track Ticket <ArrowRight size={15} />
              </button>
            </form>

            {/* Error banner when Asset ID or invalid input is provided */}
            {searchError && (
              <div
                style={{
                  maxWidth: "560px",
                  background: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                  color: "#DC2626",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.8rem",
                  marginBottom: "0.6rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem",
                  lineHeight: 1.45
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>{searchError}</span>
              </div>
            )}

            {/* Clear Helper Instructions */}
            <div style={{ fontSize: "0.8rem", color: "#64748B", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>Track maintenance status with your <strong>Ticket Number</strong> (e.g. <code>TKT-2026-000001</code>).</span>
            </div>
          </div>

          {/* Right Hero: Sample Asset Tag Illustration (Educational Preview) */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "350px",
                background: "#FFFFFF",
                borderRadius: "1rem",
                padding: "1.5rem",
                color: "#0F172A",
                boxShadow: "0 10px 25px -5px rgba(2, 132, 199, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
                border: "1px solid #E2E8F0",
                textAlign: "center"
              }}
            >
              {/* Educational Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "9999px",
                  background: "#F1F5F9",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  color: "#475569",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "0.85rem"
                }}
              >
                <Info size={13} color="#0284C7" /> Physical Sticker Preview
              </div>

              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A" }}>
                How Equipment Labels Look
              </div>
              <p style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "4px", lineHeight: 1.4 }}>
                This is an example of the physical QR sticker affixed to classroom and lab equipment:
              </p>

              {/* Physical Sticker Illustration */}
              <div
                style={{
                  margin: "1rem auto 0.75rem auto",
                  padding: "1rem",
                  background: "#F8FAFC",
                  borderRadius: "0.75rem",
                  border: "1.5px dashed #CBD5E1",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "0.65rem", fontWeight: "700", color: "#64748B", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  CAMPUSFIX • ASSET LABEL
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#0F172A", marginTop: "0.2rem" }}>
                  {sampleFeaturedAsset.itemName}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "2px" }}>
                  Room {sampleFeaturedAsset.room} • {sampleFeaturedAsset.building}
                </div>

                {/* Non-functional Sample QR Code */}
                <div
                  style={{
                    display: "inline-block",
                    margin: "0.85rem auto 0.65rem auto",
                    padding: "0.75rem",
                    background: "#FFFFFF",
                    borderRadius: "0.5rem",
                    border: "1px solid #E2E8F0"
                  }}
                >
                  <QRCodeSVG
                    value="CampusFix Example QR Tag — Demonstrates physical asset label format."
                    size={140}
                    level="M"
                    includeMargin={false}
                  />
                </div>

                <div style={{ fontFamily: "var(--font-mono)", fontWeight: "700", fontSize: "1rem", color: "#0284C7" }}>
                  {sampleFeaturedAsset.itemId}
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "2px" }}>
                  (Unique Asset ID Format)
                </div>
              </div>

              {/* Descriptive Explanatory Footer */}
              <div
                style={{
                  fontSize: "0.775rem",
                  color: "#475569",
                  lineHeight: 1.5,
                  padding: "0.6rem 0.75rem",
                  background: "#F0F9FF",
                  borderRadius: "0.5rem",
                  border: "1px solid #BAE6FD",
                  textAlign: "left"
                }}
              >
                💡 <strong style={{ color: "#0369A1" }}>Example only:</strong> Students and faculty scan the physical sticker on the actual equipment using their phone camera to file an issue directly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Cards */}
      <section style={{ maxWidth: "1280px", margin: "2.5rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div className="card-premium" style={{ padding: "1.25rem", borderLeft: "4px solid #0284C7" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Assets</div>
            <div style={{ fontSize: "1.9rem", fontWeight: "800", color: "#0F172A", marginTop: "0.15rem" }}>{stats.totalAssets}</div>
            <div style={{ fontSize: "0.775rem", color: "#0284C7", marginTop: "0.25rem", fontWeight: "500" }}>Registered in campus inventory</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem", borderLeft: "4px solid #EF4444" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Issues</div>
            <div style={{ fontSize: "1.9rem", fontWeight: "800", color: "#DC2626", marginTop: "0.15rem" }}>{stats.openTickets}</div>
            <div style={{ fontSize: "0.775rem", color: "#64748B", marginTop: "0.25rem" }}>Awaiting repair</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem", borderLeft: "4px solid #10B981" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resolved</div>
            <div style={{ fontSize: "1.9rem", fontWeight: "800", color: "#059669", marginTop: "0.15rem" }}>{stats.closedTickets}</div>
            <div style={{ fontSize: "0.775rem", color: "#059669", marginTop: "0.25rem", fontWeight: "500" }}>Fixed and verified</div>
          </div>

          <div className="card-premium" style={{ padding: "1.25rem", borderLeft: "4px solid #6366F1" }}>
            <div style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Operational Rate</div>
            <div style={{ fontSize: "1.9rem", fontWeight: "800", color: "#0F172A", marginTop: "0.15rem" }}>
              {stats.totalAssets > 0 ? `${Math.round(((stats.totalAssets - stats.openTickets) / stats.totalAssets) * 100)}%` : "100%"}
            </div>
            <div style={{ fontSize: "0.775rem", color: "#64748B", marginTop: "0.25rem" }}>Equipment working properly</div>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section style={{ maxWidth: "1280px", margin: "1rem auto 3rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: "700", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            SIMPLE WORKFLOW
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em", marginTop: "0.25rem" }}>
            How CampusFix Works
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.95rem", maxWidth: "480px", margin: "0.4rem auto 0 auto" }}>
            No complicated app downloads or logins required for reporting issues.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          <div className="card-premium" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "0.625rem", background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <QrCode size={22} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: "700" }}>STEP 01</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0.3rem 0 0.5rem 0" }}>Scan Equipment QR</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Scan the physical QR sticker on any classroom or lab device with your smartphone camera.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "0.625rem", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Smartphone size={22} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#D97706", fontWeight: "700" }}>STEP 02</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0.3rem 0 0.5rem 0" }}>Submit Issue Details</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Select what is broken, provide a short description, and submit. An instant tracking ticket is generated.
            </p>
          </div>

          <div className="card-premium" style={{ padding: "1.75rem", textAlign: "left" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "0.625rem", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Wrench size={22} />
            </div>
            <div style={{ fontSize: "0.75rem", color: "#16A34A", fontWeight: "700" }}>STEP 03</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0F172A", margin: "0.3rem 0 0.5rem 0" }}>Technician Resolves</h3>
            <p style={{ color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Campus maintenance staff inspect the asset, fix the problem on-site, and mark the ticket resolved.
            </p>
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section style={{ maxWidth: "1280px", margin: "0 auto 4rem auto", padding: "0 1.25rem", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              CAMPUS ASSET MAP
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em", marginTop: "0.2rem" }}>
              Equipment Locations & Real-Time Status
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8rem", fontWeight: "500" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#059669" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#10B981" }}></span> Operational
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#DC2626" }}>
              <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#EF4444" }}></span> Issue Reported
            </span>
          </div>
        </div>

        <div className="card-premium" style={{ padding: "0.5rem", borderRadius: "0.75rem" }}>
          <CampusMap assets={assets} tickets={tickets} height="400px" />
        </div>
      </section>
    </div>
  );
};
