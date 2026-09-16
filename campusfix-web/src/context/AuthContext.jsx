import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, isFirebaseConfigured, db } from "../firebase/firebaseConfig";
import { 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            // Check role in users/{uid}
            let role = "admin";
            if (db) {
              const userDoc = await getDoc(doc(db, "users", fbUser.uid));
              if (userDoc.exists()) {
                role = userDoc.data().role || "admin";
              }
            }
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "Admin",
              role: role
            });
          } catch (err) {
            console.error("Error checking user role:", err);
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              name: fbUser.email?.split("@")[0] || "Admin",
              role: "admin"
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local/Demo Auth state persistence
      const savedUser = localStorage.getItem("campusfix_auth_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } else {
      // Demo validation: any valid email + password with length >= 6, or demo credentials
      if (email.toLowerCase() === "admin@campusfix.edu" || email.includes("@")) {
        if (password.length >= 6) {
          const demoUser = {
            uid: "admin_demo_01",
            email: email.toLowerCase(),
            name: email.split("@")[0].toUpperCase() === "ADMIN" ? "Campus Administrator" : email.split("@")[0],
            role: "admin"
          };
          setUser(demoUser);
          localStorage.setItem("campusfix_auth_user", JSON.stringify(demoUser));
          return demoUser;
        } else {
          throw new Error("Password must be at least 6 characters.");
        }
      } else {
        throw new Error("Invalid email format.");
      }
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await fbSignOut(auth);
    } else {
      localStorage.removeItem("campusfix_auth_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", loading, login, logout, isLiveFirebase: isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};
