import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { ExternalLink, QrCode } from "lucide-react";

// Fix default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (isOpen = false) => {
  const color = isOpen ? "#EF4444" : "#10B981";
  const glow = isOpen ? "rgba(239, 68, 68, 0.4)" : "rgba(16, 185, 129, 0.4)";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background: #0B0D13;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid ${color};
        box-shadow: 0 0 12px ${glow};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 6px; height: 6px; background: ${color}; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

const MapCenterUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export const CampusMap = ({ 
  assets = [], 
  tickets = [], 
  selectedAsset = null, 
  height = "380px",
  zoom = 17,
  interactive = true 
}) => {
  const defaultCenter = [18.520430, 73.856744];
  const center = selectedAsset 
    ? [selectedAsset.latitude || defaultCenter[0], selectedAsset.longitude || defaultCenter[1]]
    : (assets.length > 0 && assets[0].latitude ? [assets[0].latitude, assets[0].longitude] : defaultCenter);

  const hasOpenTicket = (itemId) => {
    return tickets.some((t) => t.itemId === itemId && t.status === "OPEN");
  };

  return (
    <div className="dark-tiles" style={{ height, width: "100%", borderRadius: "0.75rem", overflow: "hidden", position: "relative", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        style={{ height: "100%", width: "100%", background: "#0B0D13" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" style="color: #64748B;">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterUpdater center={center} />

        {assets.map((asset) => {
          if (!asset.latitude || !asset.longitude) return null;
          const open = hasOpenTicket(asset.itemId);

          return (
            <Marker
              key={asset.itemId}
              position={[asset.latitude, asset.longitude]}
              icon={createCustomIcon(open)}
            >
              <Popup>
                <div style={{ minWidth: "190px", color: "#F8FAFC", padding: "0.25rem 0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#94A3B8" }}>
                      {asset.itemId}
                    </span>
                    <span style={{
                      fontSize: "0.625rem",
                      fontWeight: "700",
                      fontFamily: "var(--font-mono)",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "9999px",
                      background: open ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: open ? "#F87171" : "#34D399",
                      border: `1px solid ${open ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`
                    }}>
                      {open ? "ISSUE REPORTED" : "NOMINAL"}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#F8FAFC", margin: "0.125rem 0" }}>
                    {asset.itemName}
                  </h4>
                  <p style={{ fontSize: "0.775rem", color: "#94A3B8", margin: 0 }}>
                    {asset.room} • {asset.building}
                  </p>
                  
                  <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "0.5rem" }}>
                    <Link
                      to={`/admin/assets/${asset.itemId}`}
                      style={{ fontSize: "0.75rem", color: "#38BDF8", textDecoration: "none", fontWeight: "600" }}
                    >
                      Admin View →
                    </Link>
                    <Link
                      to={`/report/${asset.itemId}`}
                      target="_blank"
                      style={{ fontSize: "0.75rem", color: "#94A3B8", textDecoration: "none", marginLeft: "auto", display: "flex", alignItems: "center", gap: "2px" }}
                    >
                      QR <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
