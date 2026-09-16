import React from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  Ticket, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle, 
  Printer, 
  ArrowRight, 
  MapPin, 
  Layers,
  Activity
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/StatusBadge";
import { CampusMap } from "../../components/CampusMap";

export const AdminDashboard = () => {
  const { assets, tickets, stats } = useData();

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            OPERATIONAL TELEMETRY
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            Campus Maintenance Overview
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Link to="/admin/assets/new" className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}>
            <PlusCircle size={14} /> Register Asset
          </Link>
          <Link to="/admin/print-qr" className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}>
            <Printer size={14} /> QR Studio
          </Link>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {/* Total Assets */}
        <div className="card-premium" style={{ padding: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Assets</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#FFFFFF", marginTop: "0.1rem", letterSpacing: "-0.03em" }}>
                {stats.totalAssets}
              </div>
            </div>
            <div style={{ padding: "0.4rem", borderRadius: "0.4rem", background: "rgba(56, 189, 248, 0.1)", color: "#38BDF8" }}>
              <Box size={18} />
            </div>
          </div>
          <div style={{ fontSize: "0.725rem", color: "#64748B", marginTop: "0.35rem" }}>
            {stats.activeAssets} active on campus
          </div>
        </div>

        {/* Open Issues */}
        <div className="card-premium" style={{ padding: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Open Tickets</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#F87171", marginTop: "0.1rem", letterSpacing: "-0.03em" }}>
                {stats.openTickets}
              </div>
            </div>
            <div style={{ padding: "0.4rem", borderRadius: "0.4rem", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
              <AlertCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: "0.725rem", color: "#F87171", marginTop: "0.35rem" }}>
            Action required
          </div>
        </div>

        {/* Closed Tickets */}
        <div className="card-premium" style={{ padding: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resolved Issues</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#34D399", marginTop: "0.1rem", letterSpacing: "-0.03em" }}>
                {stats.closedTickets}
              </div>
            </div>
            <div style={{ padding: "0.4rem", borderRadius: "0.4rem", background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: "0.725rem", color: "#34D399", marginTop: "0.35rem" }}>
            Closed & Verified
          </div>
        </div>

        {/* Active Ratio */}
        <div className="card-premium" style={{ padding: "1.1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>System Health</span>
              <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#C084FC", marginTop: "0.1rem", letterSpacing: "-0.03em" }}>
                {stats.totalAssets > 0 ? `${Math.round(((stats.totalAssets - stats.openTickets) / stats.totalAssets) * 100)}%` : "100%"}
              </div>
            </div>
            <div style={{ padding: "0.4rem", borderRadius: "0.4rem", background: "rgba(168, 85, 247, 0.1)", color: "#C084FC" }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: "0.725rem", color: "#64748B", marginTop: "0.35rem" }}>
            Operational equipment ratio
          </div>
        </div>
      </div>

      {/* Grid: Geo-Map & Recent Tickets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.25rem" }}>
        {/* Map */}
        <div className="card-premium" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <MapPin size={15} color="#38BDF8" /> Campus Asset Geo-Telemetry
            </h3>
            <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#64748B" }}>
              {assets.length} Coordinates
            </span>
          </div>

          <div style={{ flex: 1, minHeight: "320px" }}>
            <CampusMap assets={assets} tickets={tickets} height="320px" zoom={17} />
          </div>
        </div>

        {/* Recent Tickets Feed */}
        <div className="card-premium" style={{ padding: "1.25rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Ticket size={15} color="#F87171" /> Recent Reported Tickets
            </h3>
            <Link to="/admin/tickets" style={{ fontSize: "0.75rem", color: "#38BDF8", textDecoration: "none", fontWeight: "600" }}>
              View All ({tickets.length}) →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, overflowY: "auto" }}>
            {stats.recentTickets && stats.recentTickets.length > 0 ? (
              stats.recentTickets.map((t) => (
                <div
                  key={t.ticketId}
                  style={{
                    background: "#0B0D13",
                    padding: "0.75rem 0.85rem",
                    borderRadius: "0.375rem",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#38BDF8", fontSize: "0.8rem" }}>
                        {t.ticketId}
                      </span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#FFFFFF", marginTop: "0.15rem" }}>
                      {t.itemSnapshot?.itemName || "Asset"} <span style={{ color: "#64748B", fontWeight: "400" }}>• {t.ticketType}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748B" }}>
                      Room {t.itemSnapshot?.room} • {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <Link
                    to={`/admin/tickets/${t.ticketId}`}
                    className="btn-secondary"
                    style={{ fontSize: "0.7rem", padding: "0.3rem 0.6rem", flexShrink: 0 }}
                  >
                    Details <ArrowRight size={11} />
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", color: "#64748B", padding: "3rem 1rem", fontSize: "0.825rem" }}>
                No active maintenance tickets reported.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
