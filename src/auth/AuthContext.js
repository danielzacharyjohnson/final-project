// src/auth/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined: loading; null: signed out

  useEffect(() => onAuthStateChanged(auth, (u) => setUser(u ?? null)), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: user === undefined,
        signOut: () => signOut(auth),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
