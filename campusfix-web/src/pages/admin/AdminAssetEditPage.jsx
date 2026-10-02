import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, AlertCircle, Info } from "lucide-react";
import { useData } from "../../context/DataContext";
import { LocationPicker } from "../../components/LocationPicker";
import { CAMPUS_BUILDINGS, CAMPUS_FLOORS, CAMPUS_ROOMS } from "../../firebase/seedData";

export const AdminAssetEditPage = () => {
  const { itemId } = useParams();
  const { assets, itemTypes, updateAsset } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    type_id: "",
    itemType: "",
    description: "",
    building: "",
    floor: "",
    room: "",
    status: "ACTIVE",
    latitude: 18.520430,
    longitude: 73.856744
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = assets.find((a) => a.itemId === itemId);
    if (existing) {
      // Find matching type_id
      const matched = itemTypes.find(
        (t) => t.type_id === existing.type_id || t.type_name === existing.itemType
      );

      setFormData({
        itemName: existing.itemName || "",
        type_id: matched ? matched.type_id : (existing.type_id || itemTypes[0]?.type_id || ""),
        itemType: matched ? matched.type_name : (existing.itemType || itemTypes[0]?.type_name || ""),
        description: existing.description || "",
        building: existing.building || "",
        floor: existing.floor || "",
        room: existing.room || "",
        status: existing.status || "ACTIVE",
        latitude: existing.latitude || 18.520430,
        longitude: existing.longitude || 73.856744
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [itemId, assets, itemTypes]);

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
      setError("Please fill out required fields (Item Name and Room).");
      return;
    }

    setSaving(true);
    try {
      await updateAsset(itemId, formData);
      navigate(`/admin/assets/${itemId}`);
    } catch (err) {
      console.error("Asset edit error:", err);
      setError(err.message || "Failed to update asset.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>
        Loading asset information...
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      <Link
        to={`/admin/assets/${itemId}`}
        className="btn-ghost"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          color: "#475569",
          fontSize: "0.85rem",
          textDecoration: "none",
          marginBottom: "1.25rem"
        }}
      >
        <ArrowLeft size={16} /> Back to Asset Details
      </Link>

      <div className="card-premium" style={{ borderRadius: "1rem", overflow: "hidden" }}>
        {/* Clean Light Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #E2E8F0", background: "#FFFFFF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em" }}>
              Edit Asset Details
            </h1>
            <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "#0284C7", fontWeight: "700" }}>
              ({itemId})
            </span>
          </div>
          <p style={{ color: "#64748B", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Modify specifications, status, or update campus GPS coordinates.
          </p>
        </div>

        <div style={{ padding: "1.75rem", background: "#FFFFFF" }}>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.85rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                  Asset Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="input-refined"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                  Asset Category / Type <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  name="type_id"
                  value={formData.type_id}
                  onChange={(e) => {
                    const chosenId = e.target.value;
                    const found = itemTypes.find((t) => t.type_id === chosenId);
                    if (found) {
                      setFormData((prev) => ({
                        ...prev,
                        type_id: found.type_id,
                        itemType: found.type_name
                      }));
                    }
                  }}
                  className="input-refined"
                  style={{ width: "100%", background: "#FFFFFF" }}
                  required
                >
                  {itemTypes.map((t) => (
                    <option key={t.type_id} value={t.type_id}>
                      {t.type_name} ({t.type_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                  Status <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-refined"
                  style={{ width: "100%", background: "#FFFFFF" }}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                className="input-refined"
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            {/* Location hierarchy */}
            <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0284C7", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.85rem" }}>
                Physical Location Hierarchy
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "0.3rem" }}>
                    Building Block <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="input-refined"
                    style={{ width: "100%", background: "#FFFFFF" }}
                    required
                  >
                    <option value="">Select Building Block...</option>
                    {CAMPUS_BUILDINGS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                    {formData.building && !CAMPUS_BUILDINGS.includes(formData.building) && (
                      <option value={formData.building}>{formData.building}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "0.3rem" }}>
                    Floor Level <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    className="input-refined"
                    style={{ width: "100%", background: "#FFFFFF" }}
                    required
                  >
                    <option value="">Select Floor Level...</option>
                    {CAMPUS_FLOORS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                    {formData.floor && !CAMPUS_FLOORS.includes(formData.floor) && (
                      <option value={formData.floor}>{formData.floor}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#475569", marginBottom: "0.3rem" }}>
                    Room / Lab Code <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                    className="input-refined"
                    style={{ width: "100%", background: "#FFFFFF" }}
                    required
                  >
                    <option value="">Select Room / Lab...</option>
                    {CAMPUS_ROOMS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    {formData.room && !CAMPUS_ROOMS.includes(formData.room) && (
                      <option value={formData.room}>{formData.room}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                <h3 style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0284C7", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                  Geographical Coordinates (OpenStreetMap)
                </h3>
              </div>
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
