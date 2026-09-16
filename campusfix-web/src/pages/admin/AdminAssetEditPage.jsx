import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useData } from "../../context/DataContext";
import { ASSET_TYPES } from "../../firebase/seedData";
import { LocationPicker } from "../../components/LocationPicker";

export const AdminAssetEditPage = () => {
  const { itemId } = useParams();
  const { getAsset, updateAsset, loading } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    itemType: ASSET_TYPES[0],
    description: "",
    building: "",
    floor: "",
    room: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    status: "ACTIVE",
    latitude: 18.520430,
    longitude: 73.856744
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && itemId) {
      const asset = getAsset(itemId);
      if (asset) {
        setFormData({
          itemName: asset.itemName || "",
          itemType: asset.itemType || ASSET_TYPES[0],
          description: asset.description || "",
          building: asset.building || "",
          floor: asset.floor || "",
          room: asset.room || "",
          manufacturer: asset.manufacturer || "",
          model: asset.model || "",
          serialNumber: asset.serialNumber || "",
          status: asset.status || "ACTIVE",
          latitude: asset.latitude || 18.520430,
          longitude: asset.longitude || 73.856744
        });
      }
    }
  }, [itemId, loading, getAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.itemName.trim() || !formData.room.trim()) {
      setError("Please fill in all required fields (Item Name and Room).");
      return;
    }

    setSaving(true);
    try {
      await updateAsset(itemId, formData);
      navigate(`/admin/assets/${itemId}`);
    } catch (err) {
      console.error("Error updating asset:", err);
      setError(err.message || "Failed to update asset.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "1.75rem auto 4rem auto", padding: "0 1.25rem" }}>
      <Link
        to={`/admin/assets/${itemId}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          color: "#94A3B8",
          fontSize: "0.85rem",
          textDecoration: "none",
          marginBottom: "1.25rem"
        }}
      >
        <ArrowLeft size={16} /> Back to Asset Details
      </Link>

      <div className="glass-card" style={{ borderRadius: "1rem", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1E293B", background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#F8FAFC" }}>
              Edit Asset Details
            </h1>
            <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "#60A5FA" }}>
              ({itemId})
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Modify specifications, status, or update campus GPS coordinates.
          </p>
        </div>

        <div style={{ padding: "1.75rem" }}>
          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#F87171", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Asset Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Asset Type <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem" }}
                >
                  {ASSET_TYPES.map((t) => (
                    <option key={t} value={t} style={{ background: "#111827" }}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Status <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem" }}
                >
                  <option value="ACTIVE" style={{ background: "#111827" }}>ACTIVE</option>
                  <option value="INACTIVE" style={{ background: "#111827" }}>INACTIVE</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="glass-input"
                style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem", resize: "vertical" }}
              />
            </div>

            {/* Location hierarchy */}
            <div style={{ background: "#0B0F19", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #1E293B" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Building Block <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Floor Level <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Room Code <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Model Number
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {/* Location Map */}
            <div style={{ background: "#0B0F19", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #1E293B" }}>
              <LocationPicker
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ flex: 1, padding: "0.75rem" }}
              >
                <Save size={16} /> {saving ? "Saving Changes..." : "Save Changes"}
              </button>
              <Link to={`/admin/assets/${itemId}`} className="btn-secondary" style={{ padding: "0.75rem 1.25rem" }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
