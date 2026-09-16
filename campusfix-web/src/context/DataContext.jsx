import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_ASSETS, INITIAL_TICKETS } from "../firebase/seedData";
import { db, isFirebaseConfigured } from "../firebase/firebaseConfig";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
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
  const [loading, setLoading] = useState(true);

  // Initialize storage
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      // Live Firestore Mode: Realtime collection listeners
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

      return () => {
        unsubAssets();
        unsubTickets();
      };
    } else {
      // Local/Demo Mode
      const storedAssets = localStorage.getItem("campusfix_assets");
      const storedTickets = localStorage.getItem("campusfix_tickets");

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

  // ---------------- ASSETS OPERATIONS ----------------
  const getAsset = (itemId) => {
    return assets.find((a) => a.itemId?.toUpperCase() === itemId?.toUpperCase());
  };

  const createAsset = async (assetData) => {
    const newId = await generateAssetId();
    const baseUrl = window.location.origin;
    const nowIso = new Date().toISOString();

    const newAsset = {
      itemId: newId,
      itemName: assetData.itemName,
      itemType: assetData.itemType,
      description: assetData.description || "",
      building: assetData.building,
      floor: assetData.floor,
      room: assetData.room,
      manufacturer: assetData.manufacturer || "",
      model: assetData.model || "",
      serialNumber: assetData.serialNumber || "",
      latitude: Number(assetData.latitude) || 18.520430,
      longitude: Number(assetData.longitude) || 73.856744,
      status: "ACTIVE",
      qrUrl: `${baseUrl}/report/${newId}`,
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
    // Soft Delete (Deactivate)
    await updateAsset(itemId, { status: "INACTIVE" });
  };

  // ---------------- TICKETS OPERATIONS ----------------
  const getTicket = (ticketId) => {
    return tickets.find((t) => t.ticketId?.toUpperCase() === ticketId?.toUpperCase());
  };

  const getTicketsByItem = (itemId) => {
    return tickets.filter((t) => t.itemId?.toUpperCase() === itemId?.toUpperCase());
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
      status: "OPEN",
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

  const closeTicket = async (ticketId, adminNotes = "", adminEmail = "admin@campusfix.edu") => {
    const nowIso = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, "tickets", ticketId), {
        status: "CLOSED",
        adminNotes: adminNotes,
        closedAt: serverTimestamp(),
        closedBy: adminEmail,
        updatedAt: serverTimestamp()
      });
    } else {
      const updatedList = tickets.map((t) => {
        if (t.ticketId === ticketId) {
          return {
            ...t,
            status: "CLOSED",
            adminNotes,
            closedAt: nowIso,
            closedBy: adminEmail,
            updatedAt: nowIso
          };
        }
        return t;
      });
      persistLocalTickets(updatedList);
    }
  };

  // Upload initial seed assets & tickets to live Firestore
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
      alert("Successfully seeded live Firestore database with initial assets and tickets!");
    } catch (err) {
      alert("Error uploading seed data to Firestore: " + err.message);
    }
  };
  // Reset to default seed data for demonstration
  const resetToSeedData = () => {
    localStorage.setItem("campusfix_assets", JSON.stringify(INITIAL_ASSETS));
    localStorage.setItem("campusfix_tickets", JSON.stringify(INITIAL_TICKETS));
    setAssets(INITIAL_ASSETS);
    setTickets(INITIAL_TICKETS);
  };

  // Compute live statistics
  const stats = {
    totalAssets: assets.length,
    activeAssets: assets.filter((a) => a.status === "ACTIVE").length,
    openTickets: tickets.filter((t) => t.status === "OPEN").length,
    closedTickets: tickets.filter((t) => t.status === "CLOSED").length,
    recentTickets: tickets.slice(0, 5)
  };

  return (
    <DataContext.Provider
      value={{
        assets,
        tickets,
        stats,
        loading,
        getAsset,
        createAsset,
        updateAsset,
        updateAssetLocation,
        deleteAsset,
        getTicket,
        getTicketsByItem,
        createTicket,
        closeTicket,
        resetToSeedData,
        uploadSeedToFirestore
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
