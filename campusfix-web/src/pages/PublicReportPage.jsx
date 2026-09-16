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
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <AlertTriangle size={24} />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "#FFFFFF", marginBottom: "0.5rem" }}>
            Asset Not Found
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            No registered asset found matching identifier <strong style={{ color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>{itemId}</strong>.
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
        <div className="card-premium" style={{ padding: "2rem", textAlign: "center", border: "1px solid rgba(52, 211, 153, 0.25)" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#34D399",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)"
            }}
          >
            <Check size={28} />
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "0.25rem" }}>
            Ticket Logged Successfully
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.825rem", marginBottom: "1.5rem" }}>
            Campus maintenance administration has received your ticket.
          </p>

          {/* Minimalist Voucher Card */}
          <div
            style={{
              background: "#0B0D13",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "0.625rem",
              padding: "1.25rem",
              textAlign: "left",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "0.75rem" }}>
              <div>
                <span style={{ fontSize: "0.65rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "var(--font-mono)" }}>TICKET REFERENCE</span>
                <div style={{ fontSize: "1.1rem", fontWeight: "700", color: "#38BDF8", fontFamily: "var(--font-mono)" }}>
                  {submittedTicket.ticketId}
                </div>
              </div>
              <StatusBadge status={submittedTicket.status} size="md" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.825rem" }}>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Asset</span>
                <div style={{ fontWeight: "600", color: "#FFFFFF" }}>{asset.itemName}</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Location</span>
                <div style={{ fontWeight: "600", color: "#FFFFFF" }}>{asset.room} ({asset.building})</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Category</span>
                <div style={{ fontWeight: "600", color: "#FFFFFF" }}>{submittedTicket.ticketType}</div>
              </div>
              <div>
                <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Reporter Phone</span>
                <div style={{ fontWeight: "600", color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>{submittedTicket.phoneNumber}</div>
              </div>
            </div>

            <div style={{ marginTop: "0.75rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "0.75rem", fontSize: "0.825rem" }}>
              <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Description:</span>
              <p style={{ color: "#CBD5E1", marginTop: "0.2rem", fontStyle: "italic" }}>
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
          color: "#94A3B8",
          fontSize: "0.8rem",
          textDecoration: "none",
          marginBottom: "1rem"
        }}
      >
        <ArrowLeft size={14} /> Back to Portal
      </Link>

      <div className="card-premium" style={{ overflow: "hidden" }}>
        {/* Verified Asset Header Bar */}
        <div style={{ padding: "1.25rem", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", background: "#0B0D13" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.675rem", fontFamily: "var(--font-mono)", color: "#38BDF8", background: "rgba(56, 189, 248, 0.1)", padding: "0.15rem 0.4rem", borderRadius: "0.25rem", fontWeight: "700" }}>
                  {asset.itemId}
                </span>
                <span style={{ fontSize: "0.725rem", color: "#64748B" }}>• {asset.itemType}</span>
              </div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: "800", color: "#FFFFFF", marginTop: "0.25rem" }}>
                {asset.itemName}
              </h1>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#94A3B8", fontSize: "0.75rem", background: "#141722", padding: "0.3rem 0.6rem", borderRadius: "0.375rem", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <MapPin size={13} color="#38BDF8" />
              <span>Room <strong>{asset.room}</strong></span>
            </div>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.8rem", marginTop: "0.4rem", lineHeight: 1.4 }}>
            {asset.description || "Campus physical asset."}
          </p>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {errorMessage && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.25)",
                color: "#F87171",
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
            {/* Category selection pills instead of boring dropdown */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Select Issue Category
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {TICKET_TYPES.map((type) => {
                  const selected = ticketType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setTicketType(type)}
                      style={{
                        padding: "0.45rem 0.75rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.8rem",
                        fontWeight: selected ? "600" : "400",
                        cursor: "pointer",
                        border: selected ? "1px solid #38BDF8" : "1px solid rgba(255, 255, 255, 0.08)",
                        background: selected ? "rgba(56, 189, 248, 0.12)" : "#0B0D13",
                        color: selected ? "#38BDF8" : "#94A3B8",
                        transition: "all 0.12s ease"
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
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Problem Description <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe what is broken or malfunctioning..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-refined"
                style={{ width: "100%", resize: "vertical" }}
                required
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.7rem", color: "#64748B" }}>
                <span>Minimum 5 characters</span>
                <span>{description.length} chars</span>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#CBD5E1", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Your Mobile Number <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-refined"
                  style={{ width: "100%", paddingLeft: "2.25rem", fontFamily: "var(--font-mono)" }}
                  required
                />
                <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
                  <Phone size={14} />
                </div>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.3rem" }}>
                Technicians will contact this number for clarification or on-site verification.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ width: "100%", padding: "0.75rem", marginTop: "0.25rem" }}
            >
              {submitting ? "Submitting Ticket..." : "Submit Maintenance Ticket"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
