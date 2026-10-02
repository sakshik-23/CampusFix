import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, QrCode, Plus, Layers, Info, X } from "lucide-react";
import { useData } from "../../context/DataContext";
import { LocationPicker } from "../../components/LocationPicker";
import { QRPreviewModal } from "../../components/QRPreviewModal";
import { CAMPUS_BUILDINGS, CAMPUS_FLOORS, CAMPUS_ROOMS } from "../../firebase/seedData";

export const AdminAssetCreatePage = () => {
  const { itemTypes, createItemType, createAsset } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemName: "",
    type_id: "",
    itemType: "",
    description: "",
    building: "",
    floor: "",
    room: "",
    latitude: 18.520430,
    longitude: 73.856744
  });

  // Keep type_id and itemType synced with loaded itemTypes
  useEffect(() => {
    if (itemTypes.length > 0 && !formData.type_id) {
      setFormData((prev) => ({
        ...prev,
        type_id: itemTypes[0].type_id,
        itemType: itemTypes[0].type_name
      }));
    }
  }, [itemTypes, formData.type_id]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdAsset, setCreatedAsset] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // New Type Modal State (ER: ADMIN defines ITEM TYPES)
  const [showNewTypeModal, setShowNewTypeModal] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    type_name: "",
    type_code: "",
    type_description: ""
  });
  const [typeSaving, setTypeSaving] = useState(false);
  const [typeError, setTypeError] = useState("");

  const selectedItemTypeObj = itemTypes.find(
    (t) => t.type_id === formData.type_id || t.type_name === formData.itemType
  ) || itemTypes[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    const chosenId = e.target.value;
    const found = itemTypes.find((t) => t.type_id === chosenId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        type_id: found.type_id,
        itemType: found.type_name
      }));
    }
  };

  const handleCreateNewType = async (e) => {
    e.preventDefault();
    setTypeError("");

    const trimmedName = newTypeData.type_name.trim();
    if (!trimmedName) {
      setTypeError("Please enter a category or type name.");
      return;
    }

    // Validation: prevent duplicate category names (case-insensitive)
    const duplicateName = itemTypes.find(
      (t) => (t.type_name || "").trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicateName) {
      setTypeError(`Category "${trimmedName}" already exists in the system.`);
      return;
    }

    // Validation: prevent duplicate type codes
    const cleanCode = (newTypeData.type_code || trimmedName.substring(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const duplicateCode = itemTypes.find(
      (t) => (t.type_code || "").trim().toUpperCase() === cleanCode
    );
    if (duplicateCode) {
      setTypeError(`Type code "${cleanCode}" is already in use by category "${duplicateCode.type_name}".`);
      return;
    }

    setTypeSaving(true);
    try {
      const created = await createItemType({
        ...newTypeData,
        type_name: trimmedName,
        type_code: cleanCode
      });
      setFormData((prev) => ({
        ...prev,
        type_id: created.type_id,
        itemType: created.type_name
      }));
      setNewTypeData({ type_name: "", type_code: "", type_description: "" });
      setShowNewTypeModal(false);
    } catch (err) {
      setTypeError(err.message || "Failed to create new item type.");
    } finally {
      setTypeSaving(false);
    }
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.itemName.trim()) {
      setError("Please provide an item or asset name.");
      return;
    }

    if (!formData.room.trim()) {
      setError("Please specify the room or lab code.");
      return;
    }

    setLoading(true);
    try {
      const asset = await createAsset(formData);
      setCreatedAsset(asset);
    } catch (err) {
      console.error("Asset creation error:", err);
      setError(err.message || "Failed to create asset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "960px", margin: "0 auto" }}>
      {/* Back button */}
      <Link
        to="/admin/assets"
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
        <ArrowLeft size={16} /> Back to Assets Inventory
      </Link>

      {/* Registration Success Modal Popup */}
      {createdAsset && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setCreatedAsset(null)}
        >
          <div
            className="card-premium"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "520px",
              padding: "2.25rem 2rem",
              borderRadius: "1.25rem",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              textAlign: "center"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close / Cross Button */}
            <button
              type="button"
              onClick={() => setCreatedAsset(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "#F1F5F9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#E2E8F0";
                e.currentTarget.style.color = "#0F172A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#F1F5F9";
                e.currentTarget.style.color = "#64748B";
              }}
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            {/* Success Icon */}
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#D1FAE5",
                color: "#059669",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem auto"
              }}
            >
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
              Asset Registered Successfully!
            </h2>
            <p style={{ color: "#475569", fontSize: "0.95rem", margin: "0.75rem 0 1.75rem 0" }}>
              Assigned Unique ID:{" "}
              <strong style={{ color: "#0284C7", fontFamily: "var(--font-mono)", fontSize: "1.05rem" }}>
                {createdAsset.itemId}
              </strong>
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={() => setShowQrModal(true)}
                className="btn-primary"
                style={{ padding: "0.75rem 1rem", fontSize: "0.925rem", width: "100%", justifyContent: "center" }}
              >
                <QrCode size={18} /> Preview & Print QR Label
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <button
                  onClick={() => navigate(`/admin/assets/${createdAsset.itemId}`)}
                  className="btn-secondary"
                  style={{ padding: "0.65rem 0.75rem", fontSize: "0.85rem", justifyContent: "center" }}
                >
                  View Asset Detail
                </button>
                <button
                  onClick={() => {
                    setCreatedAsset(null);
                    setFormData({
                      itemName: "",
                      type_id: itemTypes[0]?.type_id || "",
                      itemType: itemTypes[0]?.type_name || "",
                      description: "",
                      building: "",
                      floor: "",
                      room: "",
                      latitude: 18.520430,
                      longitude: 73.856744
                    });
                  }}
                  className="btn-secondary"
                  style={{ padding: "0.65rem 0.75rem", fontSize: "0.85rem", justifyContent: "center" }}
                >
                  + Register Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Creation Form Card */}
      <div className="card-premium" style={{ borderRadius: "1rem", overflow: "hidden" }}>
        {/* Clean Light Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #E2E8F0", background: "#FFFFFF" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0F172A", letterSpacing: "-0.025em" }}>
            Register New Campus Asset
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Enter physical specifications, select or define database item categories, and pinpoint GPS coordinates.
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
            {/* Row 1: Item Name & Type (Connected to Database ITEM TYPES) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                  Item / Asset Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g. Projector #03 or Split AC #01"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="input-refined"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#0F172A" }}>
                    Asset Category / Type <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewTypeModal(true)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#0284C7",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: 0
                    }}
                  >
                    <Plus size={13} /> + Define New Type
                  </button>
                </div>

                <select
                  name="type_id"
                  value={formData.type_id || selectedItemTypeObj?.type_id || ""}
                  onChange={handleTypeChange}
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

                {selectedItemTypeObj && (
                  <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "flex-start", gap: "0.35rem", fontSize: "0.75rem", color: "#64748B" }}>
                    <Info size={13} style={{ flexShrink: 0, marginTop: "2px", color: "#0284C7" }} />
                    <span>
                      <strong style={{ color: "#0F172A" }}>[{selectedItemTypeObj.type_code}]</strong> {selectedItemTypeObj.type_description || selectedItemTypeObj.type_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.35rem" }}>
                Description & Installation Notes
              </label>
              <textarea
                name="description"
                rows={2}
                placeholder="e.g. Ceiling mounted in front of whiteboard with VGA/HDMI wall panel."
                value={formData.description}
                onChange={handleChange}
                className="input-refined"
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            {/* Row 2: Location Details (Building, Floor, Room) */}
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
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Map Location Picker */}
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

      {/* Define New Item Type Modal (ER: ADMIN defines ITEM TYPES) */}
      {showNewTypeModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
          }}
          onClick={() => setShowNewTypeModal(false)}
        >
          <div
            className="card-premium"
            style={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "1rem",
              background: "#FFFFFF",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              overflow: "hidden"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Layers size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0F172A", margin: 0 }}>
                  Define New Item Type
                </h3>
              </div>
            </div>

            <form onSubmit={handleCreateNewType} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {typeError && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#DC2626", padding: "0.6rem", borderRadius: "0.5rem", fontSize: "0.8rem" }}>
                  {typeError}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.3rem" }}>
                  Type / Category Name <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart TV or Laboratory Microscope"
                  value={newTypeData.type_name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoCode = name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase();
                    setNewTypeData((prev) => ({
                      ...prev,
                      type_name: name,
                      type_code: prev.type_code ? prev.type_code : autoCode
                    }));
                  }}
                  className="input-refined"
                  style={{ width: "100%" }}
                  required
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.3rem" }}>
                  Type Code (3-4 Letters)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TV, MIC, WAP"
                  value={newTypeData.type_code}
                  onChange={(e) => setNewTypeData((prev) => ({ ...prev, type_code: e.target.value.toUpperCase() }))}
                  className="input-refined"
                  style={{ width: "100%", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}
                  maxLength={5}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "600", color: "#0F172A", marginBottom: "0.3rem" }}>
                  Type Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Interactive display displays mounted in lecture and seminar halls"
                  value={newTypeData.type_description}
                  onChange={(e) => setNewTypeData((prev) => ({ ...prev, type_description: e.target.value }))}
                  className="input-refined"
                  style={{ width: "100%", resize: "none" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewTypeModal(false)}
                  className="btn-ghost"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={typeSaving}
                  className="btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                >
                  {typeSaving ? "Saving..." : "Save Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
