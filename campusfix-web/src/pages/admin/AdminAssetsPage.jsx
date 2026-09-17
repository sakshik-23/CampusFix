import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Box, 
  PlusCircle, 
  Search, 
  QrCode, 
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { QRPreviewModal } from "../../components/QRPreviewModal";
import { ASSET_TYPES } from "../../firebase/seedData";

export const AdminAssetsPage = () => {
  const { assets, deleteAsset } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [qrModalAsset, setQrModalAsset] = useState(null);

  const filteredAssets = assets.filter((asset) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      asset.itemId?.toLowerCase().includes(term) ||
      asset.itemName?.toLowerCase().includes(term) ||
      asset.room?.toLowerCase().includes(term) ||
      asset.building?.toLowerCase().includes(term) ||
      asset.itemType?.toLowerCase().includes(term);

    const matchType = selectedType === "ALL" || asset.itemType === selectedType;
    const matchStatus = selectedStatus === "ALL" || asset.status === selectedStatus;

    return matchSearch && matchType && matchStatus;
  });

  const handleDelete = async (itemId, itemName) => {
    if (window.confirm(`Deactivate ${itemName} (${itemId})?`)) {
      await deleteAsset(itemId);
    }
  };

  return (
    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#38BDF8", fontWeight: "600", letterSpacing: "0.06em" }}>
            ASSET INVENTORY
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.025em", marginTop: "0.15rem" }}>
            Campus Equipment Inventory
          </h1>
        </div>

        <Link to="/admin/assets/new" className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}>
          <PlusCircle size={14} /> Register New Asset
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card-premium"
        style={{
          padding: "0.75rem 1rem",
          display: "flex",
          gap: "0.65rem",
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <input
            type="text"
            placeholder="Search assets by ID, name, room, or building..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-refined"
            style={{
              width: "100%",
              padding: "0.45rem 0.75rem 0.45rem 2rem",
              fontSize: "0.825rem"
            }}
          />
          <div style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "#64748B" }}>
            <Search size={14} />
          </div>
        </div>

        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="input-refined"
            style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem" }}
          >
            <option value="ALL" style={{ background: "#0B0D13" }}>All Categories</option>
            {ASSET_TYPES.map((t) => (
              <option key={t} value={t} style={{ background: "#0B0D13" }}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-refined"
            style={{ padding: "0.45rem 0.75rem", fontSize: "0.825rem" }}
          >
            <option value="ALL" style={{ background: "#0B0D13" }}>All Statuses</option>
            <option value="ACTIVE" style={{ background: "#0B0D13" }}>ACTIVE</option>
            <option value="INACTIVE" style={{ background: "#0B0D13" }}>INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card-premium" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.825rem" }}>
            <thead>
              <tr style={{ background: "#08090D", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", color: "#64748B", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "0.06em", fontFamily: "var(--font-mono)" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Asset ID</th>
                <th style={{ padding: "0.75rem 1rem" }}>Device / Name</th>
                <th style={{ padding: "0.75rem 1rem" }}>Category</th>
                <th style={{ padding: "0.75rem 1rem" }}>Room Location</th>
                <th style={{ padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.itemId}
                    style={{
                      borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                      transition: "background 0.1s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontWeight: "700", color: "#38BDF8" }}>
                      {asset.itemId}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: "600", color: "#FFFFFF" }}>
                      {asset.itemName}
                      {asset.model && (
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#64748B", fontWeight: "400" }}>
                          {asset.manufacturer} {asset.model}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#94A3B8" }}>
                      <span style={{ background: "#0B0D13", padding: "0.15rem 0.45rem", borderRadius: "0.25rem", fontSize: "0.725rem", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                        {asset.itemType}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#CBD5E1" }}>
                      <strong>{asset.room}</strong>
                      <span style={{ display: "block", fontSize: "0.7rem", color: "#64748B" }}>
                        Floor {asset.floor} • {asset.building}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          fontFamily: "var(--font-mono)",
                          padding: "0.1rem 0.45rem",
                          borderRadius: "9999px",
                          background: asset.status === "ACTIVE" ? "rgba(16, 185, 129, 0.1)" : "rgba(100, 116, 139, 0.1)",
                          color: asset.status === "ACTIVE" ? "#34D399" : "#94A3B8",
                          border: `1px solid ${asset.status === "ACTIVE" ? "rgba(16, 185, 129, 0.25)" : "rgba(100, 116, 139, 0.2)"}`
                        }}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        <button
                          onClick={() => setQrModalAsset(asset)}
                          className="btn-ghost"
                          style={{ padding: "0.3rem" }}
                          title="Print QR"
                        >
                          <QrCode size={14} color="#38BDF8" />
                        </button>

                        <Link
                          to={`/admin/assets/${asset.itemId}`}
                          className="btn-ghost"
                          style={{ padding: "0.3rem" }}
                          title="Details"
                        >
                          <Eye size={14} />
                        </Link>

                        <Link
                          to={`/admin/assets/${asset.itemId}/edit`}
                          className="btn-ghost"
                          style={{ padding: "0.3rem" }}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>

                        {asset.status === "ACTIVE" && (
                          <button
                            onClick={() => handleDelete(asset.itemId, asset.itemName)}
                            className="btn-ghost"
                            style={{ padding: "0.3rem", color: "#F87171" }}
                            title="Deactivate"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
                    No assets matched your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QRPreviewModal
        asset={qrModalAsset}
        isOpen={Boolean(qrModalAsset)}
        onClose={() => setQrModalAsset(null)}
      />
    </div>
  );
};
