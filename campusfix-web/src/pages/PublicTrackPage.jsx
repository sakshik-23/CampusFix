import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Ticket, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { useData } from "../context/DataContext";
import { StatusBadge } from "../components/StatusBadge";

export const PublicTrackPage = () => {
  const { tickets } = useData();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    const matched = tickets.filter((t) => {
      const matchId = t.ticketId.toLowerCase().includes(clean.toLowerCase());
      const matchPhone = t.phoneNumber && t.phoneNumber.replace(/\D/g, "").includes(clean.replace(/\D/g, ""));
      return matchId || matchPhone;
    });

    setResults(matched);
    setSearched(true);
  };

  return (
    <div style={{ maxWidth: "720px", margin: "2.5rem auto 5rem auto", padding: "0 1.25rem" }}>
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

      <div className="card-premium" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            TICKET LOOKUP
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#FFFFFF", marginTop: "0.2rem" }}>
            Track Maintenance Ticket
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.825rem", marginTop: "0.25rem" }}>
            Enter your Ticket ID (e.g. <span style={{ fontFamily: "var(--font-mono)", color: "#CBD5E1" }}>TKT-2026-000001</span>) or 10-digit registered phone number.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="e.g. TKT-2026-000001 or 9876543210"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-refined"
              style={{
                width: "100%",
                paddingLeft: "2.25rem",
                fontFamily: "var(--font-mono)"
              }}
            />
            <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
              <Ticket size={16} />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#64748B", marginBottom: "0.75rem", textTransform: "uppercase" }}>
            Found {results?.length || 0} matching records
          </div>

          {results && results.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
              {results.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  className="card-premium card-interactive"
                  style={{
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    flexWrap: "wrap"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#38BDF8", fontSize: "0.95rem" }}>
                        {ticket.ticketId}
                      </span>
                      <StatusBadge status={ticket.status} size="sm" />
                    </div>
                    <div style={{ fontWeight: "600", color: "#FFFFFF", fontSize: "0.9rem" }}>
                      {ticket.itemSnapshot?.itemName || "Asset"} • <span style={{ color: "#94A3B8", fontWeight: "400" }}>{ticket.ticketType}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.15rem" }}>
                      Room {ticket.itemSnapshot?.room} • Raised {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link
                    to={`/ticket/${ticket.ticketId}`}
                    className="btn-secondary"
                    style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                  >
                    View Status <ArrowRight size={13} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-premium" style={{ padding: "2rem", textAlign: "center", color: "#64748B" }}>
              <AlertCircle size={28} style={{ margin: "0 auto 0.5rem auto", color: "#475569" }} />
              <p style={{ fontSize: "0.85rem" }}>No tickets found for "{query}". Please verify the Ticket ID or phone number.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
