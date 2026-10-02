import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_ASSETS, INITIAL_TICKETS, INITIAL_ITEM_TYPES } from "../firebase/seedData";
import { db, isFirebaseConfigured } from "../firebase/firebaseConfig";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot, 
  runTransaction,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [itemTypes, setItemTypes] = useState(INITIAL_ITEM_TYPES);
  const [loading, setLoading] = useState(true);

  // Initialize storage
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      // Live Firestore Mode: Realtime collection listeners for items, tickets, and item_types
      const unsubAssets = onSnapshot(collection(db, "items"), (snapshot) => {
        const loadedAssets = [];
        snapshot.forEach((docSnap) => {
          loadedAssets.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort by itemId
        loadedAssets.sort((a, b) => (a.itemId > b.itemId ? 1 : -1));
        setAssets(loadedAssets);
      }, (err) => console.error("Assets snapshot error:", err));

      const unsubTickets = onSnapshot(
        query(collection(db, "tickets"), orderBy("createdAt", "desc")),
        (snapshot) => {
          const loadedTickets = [];
          snapshot.forEach((docSnap) => {
            loadedTickets.push({ id: docSnap.id, ...docSnap.data() });
          });
          setTickets(loadedTickets);
          setLoading(false);
        },
        (err) => {
          console.error("Tickets snapshot error:", err);
          setLoading(false);
        }
      );

      // Realtime listener for dynamic ITEM TYPES defined by Admin in Firestore
      const unsubItemTypes = onSnapshot(collection(db, "item_types"), async (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed initial item types if collection is empty
          try {
            for (const t of INITIAL_ITEM_TYPES) {
              await setDoc(doc(db, "item_types", t.type_id), {
                ...t,
                createdAt: serverTimestamp()
              });
            }
          } catch (e) {
            console.warn("Auto-seeding item_types failed:", e);
          }
        } else {
          const loadedTypes = [];
          snapshot.forEach((docSnap) => {
            loadedTypes.push({ id: docSnap.id, ...docSnap.data() });
          });
          loadedTypes.sort((a, b) => (a.type_name || "").localeCompare(b.type_name || ""));
          setItemTypes(loadedTypes);
        }
      }, (err) => console.error("Item types snapshot error:", err));

      return () => {
        unsubAssets();
        unsubTickets();
        unsubItemTypes();
      };
    } else {
      // Local/Demo Mode
      const storedAssets = localStorage.getItem("campusfix_assets");
      const storedTickets = localStorage.getItem("campusfix_tickets");
      const storedItemTypes = localStorage.getItem("campusfix_item_types");

      if (storedAssets) {
        try {
          setAssets(JSON.parse(storedAssets));
        } catch {
          setAssets(INITIAL_ASSETS);
          localStorage.setItem("campusfix_assets", JSON.stringify(INITIAL_ASSETS));
        }
      } else {
        setAssets(INITIAL_ASSETS);
        localStorage.setItem("campusfix_assets", JSON.stringify(INITIAL_ASSETS));
      }

      if (storedTickets) {
        try {
          setTickets(JSON.parse(storedTickets));
        } catch {
          setTickets(INITIAL_TICKETS);
          localStorage.setItem("campusfix_tickets", JSON.stringify(INITIAL_TICKETS));
        }
      } else {
        setTickets(INITIAL_TICKETS);
        localStorage.setItem("campusfix_tickets", JSON.stringify(INITIAL_TICKETS));
      }

      if (storedItemTypes) {
        try {
          setItemTypes(JSON.parse(storedItemTypes));
        } catch {
          setItemTypes(INITIAL_ITEM_TYPES);
          localStorage.setItem("campusfix_item_types", JSON.stringify(INITIAL_ITEM_TYPES));
        }
      } else {
        setItemTypes(INITIAL_ITEM_TYPES);
        localStorage.setItem("campusfix_item_types", JSON.stringify(INITIAL_ITEM_TYPES));
      }

      setLoading(false);
    }
  }, []);

  // Save changes locally in demo mode
  const persistLocalAssets = (newAssets) => {
    setAssets(newAssets);
    localStorage.setItem("campusfix_assets", JSON.stringify(newAssets));
  };

  const persistLocalTickets = (newTickets) => {
    setTickets(newTickets);
    localStorage.setItem("campusfix_tickets", JSON.stringify(newTickets));
  };

  // Helper to generate next sequential Asset ID
  const generateAssetId = useCallback(async () => {
    if (isFirebaseConfigured && db) {
      const counterRef = doc(db, "counters", "assets");
      const newId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let nextCount = 1;
        if (counterDoc.exists()) {
          nextCount = (counterDoc.data().currentCount || 0) + 1;
        }
        transaction.set(counterRef, { currentCount: nextCount }, { merge: true });
        return `AST-${String(nextCount).padStart(6, "0")}`;
      });
      return newId;
    } else {
      // Generate based on highest existing ID
      const ids = assets.map((a) => {
        const match = a.itemId?.match(/AST-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextCount = maxId + 1;
      return `AST-${String(nextCount).padStart(6, "0")}`;
    }
  }, [assets]);

  // Helper to generate next sequential Ticket ID
  const generateTicketId = useCallback(async () => {
    const currentYear = new Date().getFullYear();
    if (isFirebaseConfigured && db) {
      const counterRef = doc(db, "counters", `tickets_${currentYear}`);
      const newId = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        let nextCount = 1;
        if (counterDoc.exists()) {
          nextCount = (counterDoc.data().currentCount || 0) + 1;
        }
        transaction.set(counterRef, { currentCount: nextCount }, { merge: true });
        return `TKT-${currentYear}-${String(nextCount).padStart(6, "0")}`;
      });
      return newId;
    } else {
      const ids = tickets.map((t) => {
        const match = t.ticketId?.match(/TKT-\d+-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      });
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextCount = maxId + 1;
      return `TKT-${currentYear}-${String(nextCount).padStart(6, "0")}`;
    }
  }, [tickets]);

  // ---------------- ITEM TYPES OPERATIONS (ER: ADMIN defines ITEM TYPES) ----------------
  const createItemType = async ({ type_name, type_code, type_description }) => {
    if (!type_name || !type_name.trim()) {
      throw new Error("Item type name is required.");
    }

    const cleanName = type_name.trim();
    const cleanCode = (type_code || cleanName.substring(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Prevent duplicate category names (case-insensitive)
    const nameExists = itemTypes.some(
      (t) => (t.type_name || "").trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (nameExists) {
      throw new Error(`An item category named "${cleanName}" already exists.`);
    }

    // Prevent duplicate type codes
    const codeExists = itemTypes.some(
      (t) => (t.type_code || "").trim().toUpperCase() === cleanCode
    );
    if (codeExists) {
      throw new Error(`An item category with type code "${cleanCode}" already exists.`);
    }

    const nextNum = itemTypes.length + 1;
    const typeId = `TYP-${String(nextNum).padStart(3, "0")}`;

    const newType = {
      type_id: typeId,
      type_name: cleanName,
      type_code: cleanCode,
      type_description: type_description ? type_description.trim() : "",
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "item_types", typeId), {
        ...newType,
        createdAt: serverTimestamp()
      });
    } else {
      const updatedList = [...itemTypes, newType];
      setItemTypes(updatedList);
      localStorage.setItem("campusfix_item_types", JSON.stringify(updatedList));
    }

    return newType;
  };

  // ---------------- ASSETS OPERATIONS ----------------
  const getAsset = (itemId) => {
    return assets.find((a) => a.itemId?.toUpperCase() === itemId?.toUpperCase());
  };

  const createAsset = async (assetData) => {
    const newId = await generateAssetId();
    const baseUrl = window.location.origin;
    const nowIso = new Date().toISOString();

    // Map according to ER Diagram: ITEM TYPES (type_id) categorizes ITEMS
    const matchedType = itemTypes.find(
      (t) => t.type_id === assetData.type_id || t.type_name === assetData.itemType
    );
    const typeId = matchedType ? matchedType.type_id : (assetData.type_id || "TYP-001");
    const typeName = matchedType ? matchedType.type_name : (assetData.itemType || "Other");
    const typeCode = matchedType ? matchedType.type_code : "OTH";
    const locId = assetData.loc_id || `LOC-${(assetData.room || "GEN").replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`;

    const newAsset = {
      // ER Diagram fields
      item_id: newId,
      itemId: newId,
      item_code: newId,
      type_id: typeId,
      type_code: typeCode,
      item_name: assetData.itemName,
      itemName: assetData.itemName,
      itemType: typeName,
      loc_id: locId,
      item_map_coordinates: {
        latitude: Number(assetData.latitude) || 18.520430,
        longitude: Number(assetData.longitude) || 73.856744
      },
      item_qr_code: `${baseUrl}/report/${newId}`,
      qrUrl: `${baseUrl}/report/${newId}`,

      // Additional specifications & location details
      description: assetData.description || "",
      building: assetData.building,
      floor: assetData.floor,
      room: assetData.room,
      latitude: Number(assetData.latitude) || 18.520430,
      longitude: Number(assetData.longitude) || 73.856744,
      status: "ACTIVE",
      createdAt: nowIso,
      updatedAt: nowIso,
      locationUpdatedAt: nowIso
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "items", newId), {
        ...newAsset,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        locationUpdatedAt: serverTimestamp()
      });
    } else {
      const updatedList = [newAsset, ...assets];
      persistLocalAssets(updatedList);
    }

    return newAsset;
  };

  const permanentDeleteAsset = async (itemId) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "items", itemId));
    } else {
      const updatedList = assets.filter((a) => a.itemId !== itemId);
      persistLocalAssets(updatedList);
    }
  };

  const updateAsset = async (itemId, updateFields) => {
    const nowIso = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "items", itemId), {
        ...updateFields,
        updatedAt: serverTimestamp()
      });
    } else {
      const updatedList = assets.map((a) => {
        if (a.itemId === itemId) {
          return { ...a, ...updateFields, updatedAt: nowIso };
        }
        return a;
      });
      persistLocalAssets(updatedList);
    }
  };

  const updateAssetLocation = async (itemId, lat, lng) => {
    const nowIso = new Date().toISOString();
    const updateData = {
      latitude: Number(lat),
      longitude: Number(lng),
      locationUpdatedAt: nowIso,
      updatedAt: nowIso
    };

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "items", itemId), {
        latitude: Number(lat),
        longitude: Number(lng),
        locationUpdatedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      const updatedList = assets.map((a) => {
        if (a.itemId === itemId) {
          return { ...a, ...updateData };
        }
        return a;
      });
      persistLocalAssets(updatedList);
    }
  };

  const deleteAsset = async (itemId) => {
    // Soft Delete: Mark asset as INACTIVE
    await updateAsset(itemId, { status: "INACTIVE" });
  };

  // ---------------- TICKETS OPERATIONS ----------------
  const getTicket = (ticketId) => {
    return tickets.find((t) => t.ticketId?.toUpperCase() === ticketId?.toUpperCase());
  };

  const getTicketsByItem = (itemId) => {
    return tickets.filter((t) => t.itemId?.toUpperCase() === itemId?.toUpperCase());
  };

  const deleteTicketPermanently = async (ticketId) => {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, "tickets", ticketId));
    } else {
      const updatedList = tickets.filter((t) => t.ticketId !== ticketId);
      persistLocalTickets(updatedList);
    }
  };

  const createTicket = async ({ itemId, ticketType, description, phoneNumber }) => {
    const asset = getAsset(itemId);
    if (!asset) {
      throw new Error(`Asset with ID ${itemId} was not found.`);
    }

    const ticketId = await generateTicketId();
    const nowIso = new Date().toISOString();

    const newTicket = {
      ticketId,
      itemId: asset.itemId,
      ticketType,
      description,
      phoneNumber,
      status: "ACTIVE",
      latitude: asset.latitude || 18.520430,
      longitude: asset.longitude || 73.856744,
      itemSnapshot: {
        itemName: asset.itemName,
        itemType: asset.itemType,
        building: asset.building,
        floor: asset.floor,
        room: asset.room
      },
      adminNotes: "",
      createdAt: nowIso,
      updatedAt: nowIso,
      closedAt: null,
      closedBy: null
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "tickets", ticketId), {
        ...newTicket,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      const updatedList = [newTicket, ...tickets];
      persistLocalTickets(updatedList);
    }

    return newTicket;
  };

  const updateTicketStatus = async (ticketId, newStatus, adminNotes = "") => {
    const cleanStatus = newStatus.toUpperCase().replace("-", "_").trim();
    if (cleanStatus === "RESOLVED" || cleanStatus === "CLOSED") {
      // Entirely remove the ticket from the system
      await deleteTicketPermanently(ticketId);
      return;
    }

    const nowIso = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "tickets", ticketId), {
        status: cleanStatus,
        adminNotes: adminNotes,
        updatedAt: serverTimestamp()
      });
    } else {
      const updatedList = tickets.map((t) => {
        if (t.ticketId === ticketId) {
          return {
            ...t,
            status: cleanStatus,
            adminNotes: adminNotes || t.adminNotes,
            updatedAt: nowIso
          };
        }
        return t;
      });
      persistLocalTickets(updatedList);
    }
  };

  const closeTicket = async (ticketId, adminNotes = "", adminEmail = "admin@campusfix.edu") => {
    // When resolved, the ticket raised must be entirely removed from the system
    await deleteTicketPermanently(ticketId);
  };

  // Upload initial seed assets, tickets & item types to live Firestore
  const uploadSeedToFirestore = async () => {
    if (!isFirebaseConfigured || !db) {
      alert("Please configure your Firebase credentials in .env first.");
      return;
    }
    try {
      for (const item of INITIAL_ASSETS) {
        await setDoc(doc(db, "items", item.itemId), item);
      }
      for (const ticket of INITIAL_TICKETS) {
        await setDoc(doc(db, "tickets", ticket.ticketId), ticket);
      }
      for (const type of INITIAL_ITEM_TYPES) {
        await setDoc(doc(db, "item_types", type.type_id), type);
      }
      alert("Successfully seeded live Firestore database with initial item types, assets, and tickets!");
    } catch (err) {
      alert("Error uploading seed data to Firestore: " + err.message);
    }
  };
  // Reset to default seed data for demonstration
  const resetToSeedData = () => {
    localStorage.setItem("campusfix_assets", JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem("campusfix_tickets", JSON.stringify(INITIAL_TICKETS));
    localStorage.setItem("campusfix_item_types", JSON.stringify(INITIAL_ITEM_TYPES));
    setAssets(INITIAL_ASSETS);
    setTickets(INITIAL_TICKETS);
    setItemTypes(INITIAL_ITEM_TYPES);
  };

  // Compute live statistics
  const stats = {
    totalAssets: assets.length,
    activeAssets: assets.filter((a) => a.status === "ACTIVE").length,
    openTickets: tickets.filter((t) => t.status === "ACTIVE" || t.status === "OPEN").length,
    inProgressTickets: tickets.filter((t) => t.status === "IN_PROGRESS" || t.status === "IN PROGRESS").length,
    closedTickets: tickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length,
    recentTickets: tickets.slice(0, 5)
  };

  return (
    <DataContext.Provider
      value={{
        assets,
        tickets,
        itemTypes,
        stats,
        loading,
        getAsset,
        createAsset,
        updateAsset,
        updateAssetLocation,
        deleteAsset,
        permanentDeleteAsset,
        createItemType,
        getTicket,
        getTicketsByItem,
        createTicket,
        updateTicketStatus,
        deleteTicketPermanently,
        closeTicket,
        resetToSeedData,
        uploadSeedToFirestore
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
