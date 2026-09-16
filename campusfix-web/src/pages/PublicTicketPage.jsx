import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Phone, 
  Box, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Wrench,
  ExternalLink,
  ShieldCheck,
  Check
} from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { CampusMap } from "../components/CampusMap";

export const PublicTicketPage = () => {
  const { ticketId } = useParams();
  const { getTicket, getAsset, loading } = useData();

  const [ticket, setTicket] = useState(null);
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (!loading && ticketId) {
      const foundTicket = getTicket(ticketId);
      setTicket(foundTicket || null);
      if (foundTicket) {
        const foundAsset = getAsset(foundTicket.itemId);
        setAsset(foundAsset || null);
      }
    }
  }, [ticketId, loading, getTicket, getAsset]);

  const maskPhone = (phoneStr) => {
    if (!phoneStr) return "N/A";
    const clean = phoneStr.trim();
    if (clean.length > 4) {
      const lastDigits = clean.slice(-2);
      return `+91 ••••••••${lastDigits}`;
    }
    return "+91 ••••••••00";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <div className="pulse-open" style={{ width: "20px", height: "20px", background: "#38BDF8", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
          <p style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>Loading ticket records...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={{ maxWidth: "540px", margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
        <div className="card-premium" style={{ padding: "2.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Ticket Not Found
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            No record found for ticket reference <strong style={{ color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>{ticketId}</strong>.
          </p>
          <Link to="/track" className="btn-secondary">
            <ArrowLeft size={14} /> Look Up Another Ticket
          </Link>
        </div>
      </div>
    );
  }

  const assetInfo = ticket.itemSnapshot || asset || {};
  const isClosed = ticket.status === "CLOSED";

  return (
    <div style={{ maxWidth: "780px", margin: "2.5rem auto 5rem auto", padding: "0 1.25rem" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Link
          to="/track"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "#94A3B8",
            fontSize: "0.8rem",
            textDecoration: "none"
          }}
        >
          <ArrowLeft size={14} /> Ticket Lookup
        </Link>
        <span style={{ fontSize: "0.75rem", color: "#64748B", fontFamily: "var(--font-mono)" }}>
          ID: {ticket.ticketId}
        </span>
      </div>

      <div className="card-premium" style={{ overflow: "hidden" }}>
        {/* Top Header Pass */}
        <div
          style={{
            background: "#0B0D13",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            padding: "1.5rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.65rem", color: "#64748B", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.08em", fontFamily: "var(--font-mono)" }}>
                CAMPUS MAINTENANCE VOUCHER
              </span>
              <h1 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#FFFFFF", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
                {ticket.ticketId}
              </h1>
            </div>
            <StatusBadge status={ticket.status} size="lg" />
          </div>

          {/* Simple 2-Step Progression Bar */}
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "#38BDF8", fontWeight: "600" }}>
              <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: "rgba(56, 189, 248, 0.15)", border: "1px solid #38BDF8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>✓</span>
              Reported
            </div>
            <div style={{ flex: 1, height: "1px", background: isClosed ? "#10B981" : "rgba(255, 255, 255, 0.1)" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: isClosed ? "#34D399" : "#64748B", fontWeight: isClosed ? "600" : "400" }}>
              <span style={{ width: "16px", height: "16px", borderRadius: "50%", background: isClosed ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)", border: isClosed ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem" }}>
                {isClosed ? "✓" : "2"}
              </span>
              Resolved on Site
            </div>
          </div>
        </div>

        {/* Details Content */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Issue Info */}
          <div style={{ background: "#0B0D13", padding: "1.25rem", borderRadius: "0.625rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Category</span>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF", marginTop: "0.1rem" }}>
                  {ticket.ticketType}
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Contact Phone (Masked)</span>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-mono)", marginTop: "0.1rem" }}>
                  {maskPhone(ticket.phoneNumber)}
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Defect Description</span>
              <div style={{ background: "#11141D", padding: "0.85rem", borderRadius: "0.375rem", marginTop: "0.25rem", color: "#E2E8F0", fontSize: "0.875rem", lineHeight: 1.5, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                "{ticket.description}"
              </div>
            </div>

            {/* Resolution Note if Closed */}
            {ticket.adminNotes && (
              <div style={{ marginTop: "1rem", background: "rgba(16, 185, 129, 0.06)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.85rem", borderRadius: "0.375rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#34D399", fontSize: "0.75rem", fontWeight: "700" }}>
                  <Wrench size={13} /> Technician Resolution Remarks:
                </div>
                <p style={{ color: "#D1FAE5", fontSize: "0.85rem", marginTop: "0.25rem", margin: 0 }}>
                  {ticket.adminNotes}
                </p>
              </div>
            )}
          </div>

          {/* Asset & Location Snapshot */}
          <div style={{ background: "#0B0F19", padding: "1.25rem", borderRadius: "0.625rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Asset Name</span>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF" }}>
                  {assetInfo.itemName || "Asset"} <span style={{ fontSize: "0.75rem", color: "#38BDF8", fontFamily: "var(--font-mono)" }}>({ticket.itemId})</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Room / Block</span>
                <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "#FFFFFF" }}>
                  Room {assetInfo.room} • {assetInfo.building}
                </div>
              </div>
            </div>

            {/* Embedded Dark Map */}
            <div style={{ height: "200px", borderRadius: "0.375rem", overflow: "hidden" }}>
              <CampusMap
                assets={[{
                  itemId: ticket.itemId,
                  itemName: assetInfo.itemName || "Asset",
                  room: assetInfo.room,
                  building: assetInfo.building,
                  latitude: ticket.latitude,
                  longitude: ticket.longitude
                }]}
                tickets={[ticket]}
                selectedAsset={{ latitude: ticket.latitude, longitude: ticket.longitude }}
                height="100%"
                zoom={18}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
