import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Box, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Printer, 
  Edit, 
  Trash2, 
  QrCode, 
  Ticket, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { CampusMap } from "../../components/CampusMap";
import { StatusBadge } from "../../components/StatusBadge";
import { QRPreviewModal } from "../../components/QRPreviewModal";

export const AdminAssetDetailPage = () => {
  const { itemId } = useParams();
  const { getAsset, getTicketsByItem, deleteAsset, loading } = useData();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (!loading && itemId) {
      const foundAsset = getAsset(itemId);
      setAsset(foundAsset || null);
      if (foundAsset) {
        setTickets(getTicketsByItem(itemId));
      }
    }
  }, [itemId, loading, getAsset, getTicketsByItem]);

  const handleDelete = async () => {
    if (window.confirm(`Deactivate ${asset.itemName} (${asset.itemId})?`)) {
      await deleteAsset(asset.itemId);
      navigate("/admin/assets");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
        Loading asset details...
      </div>
    );
  }

  if (!asset) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ color: "#F8FAFC" }}>Asset Not Found</h2>
        <p style={{ color: "#94A3B8", margin: "1rem 0" }}>No asset with ID {itemId} exists.</p>
        <Link to="/admin/assets" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Assets List
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Top Header & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            to="/admin/assets"
            className="btn-secondary"
            style={{ padding: "0.4rem 0.6rem" }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#F8FAFC" }}>
                {asset.itemName}
              </h1>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontWeight: "700" }}>
                {asset.itemId}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "9999px",
                  background: asset.status === "ACTIVE" ? "rgba(16, 185, 129, 0.15)" : "rgba(100, 116, 139, 0.2)",
                  color: asset.status === "ACTIVE" ? "#10B981" : "#94A3B8"
                }}
              >
                {asset.status}
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "0.15rem" }}>
              {asset.room} • {asset.building}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            onClick={() => setShowQrModal(true)}
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.45rem 0.85rem" }}
          >
            <Printer size={15} /> Print QR Sticker
          </button>
          <Link
            to={`/admin/assets/${asset.itemId}/edit`}
            className="btn-secondary"
            style={{ fontSize: "0.85rem", padding: "0.45rem 0.85rem" }}
          >
            <Edit size={15} /> Edit Asset
          </Link>
          {asset.status === "ACTIVE" && (
            <button
              onClick={handleDelete}
              className="btn-secondary"
              style={{ fontSize: "0.85rem", padding: "0.45rem 0.85rem", color: "#F87171" }}
              title="Deactivate Asset"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Specifications & Geo-Location */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {/* Specifications Card (PRD FR-17) */}
        <div className="card-premium" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#F8FAFC", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Box size={18} color="#0284C7" /> Asset Specifications
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.875rem" }}>
            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Category / Type</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>{asset.itemType}</div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Room Code</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>{asset.room}</div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Floor Level</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>Floor {asset.floor}</div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Building</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>{asset.building}</div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Manufacturer</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>{asset.manufacturer || "N/A"}</div>
            </div>

            <div>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Model</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", marginTop: "0.15rem" }}>{asset.model || "N/A"}</div>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Serial Number</span>
              <div style={{ color: "#F8FAFC", fontWeight: "600", fontFamily: "var(--font-mono)", marginTop: "0.15rem" }}>{asset.serialNumber || "N/A"}</div>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <span style={{ color: "#64748B", fontSize: "0.75rem", textTransform: "uppercase" }}>Description</span>
              <p style={{ color: "#94A3B8", marginTop: "0.25rem", lineHeight: 1.5 }}>
                {asset.description || "No specific remarks registered."}
              </p>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "1.25rem", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748B" }}>
            <span>Registered: {new Date(asset.createdAt).toLocaleDateString()}</span>
            <span>Last Updated: {new Date(asset.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Geo-Location Map Card (PRD FR-20, FR-37) */}
        <div className="card-premium" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={18} color="#0284C7" /> Map Coordinates
            </h3>
            <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#94A3B8" }}>
              {asset.latitude?.toFixed(6)}, {asset.longitude?.toFixed(6)}
            </span>
          </div>

          <div style={{ flex: 1, minHeight: "220px" }}>
            <CampusMap
              assets={[asset]}
              tickets={tickets}
              selectedAsset={asset}
              height="220px"
              zoom={18}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", fontSize: "0.75rem", color: "#64748B" }}>
            <span>GPS Updated: {asset.locationUpdatedAt ? new Date(asset.locationUpdatedAt).toLocaleDateString() : "Default"}</span>
            <Link to={`/report/${asset.itemId}`} target="_blank" style={{ color: "#38BDF8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Open QR Link <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Asset Maintenance History (PRD FR-40, FR-41) */}
      <div className="card-premium" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Ticket size={18} color="#EF4444" /> Maintenance History ({tickets.length})
          </h3>
        </div>

        {tickets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tickets.map((t) => (
              <div
                key={t.ticketId}
                style={{
                  background: "#090A0F",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "#38BDF8", fontSize: "0.9rem" }}>
                      {t.ticketId}
                    </span>
                    <StatusBadge status={t.status} size="sm" />
                    <span style={{ fontSize: "0.8rem", color: "#CBD5E1", fontWeight: "600" }}>
                      • {t.ticketType}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.25rem", margin: 0 }}>
                    "{t.description}"
                  </p>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.35rem" }}>
                    Raised by {t.phoneNumber} on {new Date(t.createdAt).toLocaleDateString()}
                    {t.closedAt && ` • Closed on ${new Date(t.closedAt).toLocaleDateString()}`}
                  </div>
                </div>

                <Link
                  to={`/admin/tickets/${t.ticketId}`}
                  className="btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
            No maintenance issues recorded for this asset.
          </div>
        )}
      </div>

      {/* QR Sticker Modal */}
      <QRPreviewModal
        asset={asset}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
