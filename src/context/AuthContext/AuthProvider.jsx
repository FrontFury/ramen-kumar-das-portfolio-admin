import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { AuthContext } from "../AuthContext/AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Current User:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    setLoading(true);
    // Return promise so that handleLogout can await it properly
    return signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
      })
      .catch((err) => {
        console.error("Signout Error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const authInfo = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;