import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Box, 
  PlusCircle, 
  MapPin, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Printer, 
  QrCode 
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { ASSET_TYPES } from "../../firebase/seedData";
import { LocationPicker } from "../../components/LocationPicker";
import { QRPreviewModal } from "../../components/QRPreviewModal";

export const AdminAssetCreatePage = () => {
  const { createAsset } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    itemType: ASSET_TYPES[0],
    description: "",
    building: "Main Academic Block",
    floor: "2",
    room: "",
    manufacturer: "",
    model: "",
    serialNumber: "",
    latitude: 18.520430,
    longitude: 73.856744
  });

  const [loading, setLoading] = useState(false);
  const [createdAsset, setCreatedAsset] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [error, setError] = useState("");

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
      setError("Please fill in all required fields (Item Name and Room Number).");
      return;
    }

    setLoading(true);
    try {
      const asset = await createAsset(formData);
      setCreatedAsset(asset);
    } catch (err) {
      console.error("Error creating asset:", err);
      setError(err.message || "Failed to create asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "880px", margin: "1.75rem auto 4rem auto", padding: "0 1.25rem" }}>
      {/* Back button */}
      <Link
        to="/admin/assets"
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
        <ArrowLeft size={16} /> Back to Assets Inventory
      </Link>

      {/* Success Modal / Prompt */}
      {createdAsset && (
        <div className="glass-card" style={{ padding: "2rem", borderRadius: "1rem", marginBottom: "2rem", border: "1px solid rgba(16, 185, 129, 0.4)", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
            <Check size={28} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#F8FAFC" }}>
            Asset Registered Successfully!
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", margin: "0.5rem 0 1.5rem 0" }}>
            Assigned Unique ID: <strong style={{ color: "#60A5FA", fontFamily: "var(--font-mono)" }}>{createdAsset.itemId}</strong>
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowQrModal(true)}
              className="btn-primary"
            >
              <QrCode size={16} /> Preview & Print QR Label
            </button>
            <button
              onClick={() => navigate(`/admin/assets/${createdAsset.itemId}`)}
              className="btn-secondary"
            >
              View Asset Detail
            </button>
            <button
              onClick={() => {
                setCreatedAsset(null);
                setFormData({
                  itemName: "",
                  itemType: ASSET_TYPES[0],
                  description: "",
                  building: "Main Academic Block",
                  floor: "2",
                  room: "",
                  manufacturer: "",
                  model: "",
                  serialNumber: "",
                  latitude: 18.520430,
                  longitude: 73.856744
                });
              }}
              className="btn-secondary"
            >
              + Register Another Asset
            </button>
          </div>
        </div>
      )}

      {/* Main Creation Form */}
      <div className="glass-card" style={{ borderRadius: "1rem", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1E293B", background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#F8FAFC" }}>
            Register New Campus Asset
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Enter physical specifications and pinpoint GPS coordinates on campus map.
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
            {/* Row 1: Item Name & Type */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Item / Asset Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g. Projector #03 or Split AC #01"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                  Asset Category / Type <span style={{ color: "#EF4444" }}>*</span>
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
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#E2E8F0", marginBottom: "0.35rem" }}>
                Description & Installation Notes
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="e.g. Ceiling mounted in front of whiteboard with VGA/HDMI wall panel."
                value={formData.description}
                onChange={handleChange}
                className="glass-input"
                style={{ width: "100%", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", fontSize: "0.9rem", resize: "vertical" }}
              />
            </div>

            {/* Row 2: Location Details (Building, Floor, Room) */}
            <div style={{ background: "#0B0F19", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #1E293B" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
                Physical Location Hierarchy
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Building Block <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="building"
                    placeholder="e.g. Main Academic Block"
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
                    placeholder="e.g. 2 or Ground"
                    value={formData.floor}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                    Room / Lab Code <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="room"
                    placeholder="e.g. A-203 or MCA Lab 1"
                    value={formData.room}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Manufacturer, Model, Serial Number */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Manufacturer (Optional)
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  placeholder="e.g. Epson, Voltas"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Model Number (Optional)
                </label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g. EB-X06"
                  value={formData.model}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "0.25rem" }}>
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  placeholder="e.g. SN-88231"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  className="glass-input"
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            {/* Row 4: Map Location Picker (PRD FR-20, FR-22) */}
            <div style={{ background: "#0B0F19", padding: "1.25rem", borderRadius: "0.75rem", border: "1px solid #1E293B" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                  Geographical Coordinates (OpenStreetMap)
                </h3>
              </div>
              <LocationPicker
                initialLat={formData.latitude}
                initialLng={formData.longitude}
                onLocationChange={handleLocationChange}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "0.875rem", fontSize: "1rem" }}
            >
              {loading ? "Registering Asset in Database..." : "Register Asset & Generate Unique QR"}
            </button>
          </form>
        </div>
      </div>

      {/* QR Modal on creation */}
      <QRPreviewModal
        asset={createdAsset}
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
};
