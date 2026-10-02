import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  QrCode, 
  MapPin, 
  AlertTriangle, 
  Phone, 
  Send, 
  CheckCircle2, 
  ArrowLeft,
  Wrench,
  Check,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { useData } from "../context/DataContext";
import { TICKET_TYPES } from "../firebase/seedData";
import { StatusBadge } from "../components/StatusBadge";

export const PublicReportPage = () => {
  const { itemId } = useParams();
  const { getAsset, createTicket, loading } = useData();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [ticketType, setTicketType] = useState(TICKET_TYPES[0]);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && itemId) {
      const found = getAsset(itemId);
      setAsset(found || null);
    }
  }, [itemId, loading, getAsset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!description.trim() || description.trim().length < 5) {
      setErrorMessage("Please enter a clear description of the defect (minimum 5 characters).");
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number (e.g. 9876543210).");
      return;
    }

    const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+91 ${cleanPhone.replace(/^0+/, "")}`;

    setSubmitting(true);
    try {
      const newTicket = await createTicket({
        itemId: asset.itemId,
        ticketType,
        description: description.trim(),
        phoneNumber: formattedPhone
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSubmittedTicket(newTicket);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setErrorMessage(err.message || "Failed to submit ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <div className="pulse-open" style={{ width: "20px", height: "20px", background: "#38BDF8", borderRadius: "50%", margin: "0 auto 1rem auto" }}></div>
          <p style={{ fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>Resolving asset telemetry...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div style={{ maxWidth: "540px", margin: "4rem auto", padding: "0 1.25rem", textAlign: "center" }}>
        <div className="card-premium" style={{ padding: "2.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FEF2F2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", border: "1px solid #FCA5A5" }}>
            <AlertTriangle size={24} />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0F172A", marginBottom: "0.5rem" }}>
            Asset Not Found
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            No registered asset found matching identifier <strong style={{ color: "#0F172A", fontFamily: "var(--font-mono)" }}>{itemId}</strong>.
          </p>
          <Link to="/" className="btn-secondary">
            <ArrowLeft size={14} /> Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  // Confirmation Voucher
  if (submittedTicket) {
    return (
      <div style={{ maxWidth: "520px", margin: "3rem auto 5rem auto", padding: "0 1.25rem" }}>
        <div className="card-premium" style={{ padding: "2rem", textAlign: "center", border: "1px solid #86EFAC" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#DCFCE7",
              color: "#16A34A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
              boxShadow: "0 2px 8px rgba(22, 163, 74, 0.15)"
            }}
          >
            <Check size={28} />
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", marginBottom: "0.25rem" }}>
            Ticket Logged Successfully
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.825rem", marginBottom: "1.5rem" }}>
            Campus maintenance administration has received your ticket.
          </p>

          {/* Minimalist Voucher Card */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "0.625rem",
              padding: "1.25rem",
              textAlign: "left",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.65rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)", fontWeight: "600" }}>TICKET REFERENCE</span>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0284C7", fontFamily: "var(--font-mono)" }}>
                  {submittedTicket.ticketId}
                </div>
              </div>
              <StatusBadge status={submittedTicket.status} size="md" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.825rem" }}>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.725rem", display: "block" }}>Asset</span>
                <div style={{ fontWeight: "600", color: "#0F172A" }}>{asset.itemName}</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.725rem", display: "block" }}>Location</span>
                <div style={{ fontWeight: "600", color: "#0F172A" }}>{asset.room} ({asset.building})</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.725rem", display: "block" }}>Category</span>
                <div style={{ fontWeight: "600", color: "#0F172A" }}>{submittedTicket.ticketType}</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.725rem", display: "block" }}>Reporter Phone</span>
                <div style={{ fontWeight: "600", color: "#0F172A", fontFamily: "var(--font-mono)" }}>{submittedTicket.phoneNumber}</div>
              </div>
            </div>

            <div style={{ marginTop: "0.75rem", borderTop: "1px solid #E2E8F0", paddingTop: "0.75rem", fontSize: "0.825rem" }}>
              <span style={{ color: "#64748B", fontSize: "0.725rem", display: "block", marginBottom: "0.2rem" }}>Description:</span>
              <p style={{ color: "#334155", background: "#FFFFFF", padding: "0.6rem 0.75rem", borderRadius: "0.375rem", border: "1px solid #E2E8F0", margin: 0, fontStyle: "italic", fontSize: "0.8rem", lineHeight: 1.45 }}>
                "{submittedTicket.description}"
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <Link
              to={`/ticket/${submittedTicket.ticketId}`}
              className="btn-primary"
              style={{ width: "100%" }}
            >
              Track Ticket
            </Link>
            <Link
              to="/"
              className="btn-secondary"
              style={{ width: "100%" }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "620px", margin: "2rem auto 4rem auto", padding: "0 1.25rem" }}>
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          color: "#64748B",
          fontSize: "0.825rem",
          textDecoration: "none",
          marginBottom: "1rem",
          fontWeight: "500"
        }}
      >
        <ArrowLeft size={14} /> Back to Portal
      </Link>

      <div className="card-premium" style={{ overflow: "hidden" }}>
        {/* Verified Asset Header Bar - Clean Uniform Light Design */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E8F0", background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#0284C7", background: "#E0F2FE", border: "1px solid #BAE6FD", padding: "0.15rem 0.5rem", borderRadius: "0.375rem", fontWeight: "700" }}>
                  {asset.itemId}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: "500" }}>• {asset.itemType}</span>
              </div>
              <h1 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#0F172A", marginTop: "0.35rem", letterSpacing: "-0.02em" }}>
                {asset.itemName}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#334155", fontSize: "0.75rem", background: "#FFFFFF", padding: "0.35rem 0.65rem", borderRadius: "0.375rem", border: "1px solid #CBD5E1", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <MapPin size={13} color="#0284C7" />
              <span>Room <strong>{asset.room}</strong></span>
            </div>
          </div>
          <p style={{ color: "#64748B", fontSize: "0.825rem", marginTop: "0.45rem", lineHeight: 1.45 }}>
            {asset.description || "Campus physical asset registered in maintenance database."}
          </p>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {errorMessage && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#DC2626",
                padding: "0.65rem 0.85rem",
                borderRadius: "0.5rem",
                fontSize: "0.825rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Category selection chips - Uniform Clean Palette */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#334155", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Select Issue Category
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {TICKET_TYPES.map((type) => {
                  const selected = ticketType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTicketType(type)}
                      style={{
                        padding: "0.45rem 0.8rem",
                        borderRadius: "0.45rem",
                        fontSize: "0.8rem",
                        fontWeight: selected ? "700" : "500",
                        cursor: "pointer",
                        border: selected ? "1px solid #0284C7" : "1px solid #CBD5E1",
                        background: selected ? "#EFF6FF" : "#F8FAFC",
                        color: selected ? "#0284C7" : "#475569",
                        boxShadow: selected ? "0 1px 3px rgba(2, 132, 199, 0.15)" : "none",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description input */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Problem Description <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe what is broken or malfunctioning..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-refined"
                style={{ width: "100%", resize: "vertical", background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1" }}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.725rem", color: "#64748B" }}>
                <span>Minimum 5 characters</span>
                <span>{description.length} chars</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "700", color: "#334155", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Your Mobile Number <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-refined"
                  style={{ width: "100%", paddingLeft: "2.25rem", fontFamily: "var(--font-mono)", background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1" }}
                  required
                />
                <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
                  <Phone size={14} />
                </div>
              </div>
              <p style={{ fontSize: "0.725rem", color: "#64748B", marginTop: "0.3rem" }}>
                Technicians will contact this number for clarification or on-site verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: "100%", padding: "0.75rem", marginTop: "0.25rem", fontWeight: "700", fontSize: "0.9rem" }}
            >
              {submitting ? "Submitting Ticket..." : "Submit Maintenance Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
