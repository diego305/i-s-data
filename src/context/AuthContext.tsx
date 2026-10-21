import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle, logoutUser, parseAuthError, AuthDiagnosticError } from "../lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: AuthDiagnosticError | null;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  authError: null,
  login: async () => { throw new Error("AuthContext not ready"); },
  logout: async () => {},
  clearAuthError: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthDiagnosticError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        setAuthError(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (): Promise<User | null> => {
    try {
      setAuthError(null);
      const user = await loginWithGoogle();
      return user;
    } catch (err: any) {
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setAuthError(null);
    } catch (err: any) {
      console.error("Logout error", err);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, authError, login, logout, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
