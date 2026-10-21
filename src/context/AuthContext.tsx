import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle, logoutUser, parseAuthError, AuthDiagnosticError } from "../lib/firebase";

export interface GuestUser {
  name: string;
  email: string;
  isGuest: true;
}

interface AuthContextType {
  currentUser: User | null;
  isGuest: boolean;
  guestUser: GuestUser | null;
  loading: boolean;
  authError: AuthDiagnosticError | null;
  login: () => Promise<User | null>;
  logout: () => Promise<void>;
  enterGuestMode: (guestName?: string) => void;
  exitGuestMode: () => void;
  clearAuthError: () => void;
}

const GUEST_STORAGE_KEY = "is_data_solutions_guest_user";

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isGuest: false,
  guestUser: null,
  loading: true,
  authError: null,
  login: async () => { throw new Error("AuthContext not ready"); },
  logout: async () => {},
  enterGuestMode: () => {},
  exitGuestMode: () => {},
  clearAuthError: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !!parsed?.isGuest;
      }
    } catch {
      // fallback
    }
    return false;
  });
  const [guestUser, setGuestUser] = useState<GuestUser | null>(() => {
    try {
      const saved = localStorage.getItem(GUEST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthDiagnosticError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        setAuthError(null);
        // If logged in to real Google account, clear guest mode
        setIsGuest(false);
        setGuestUser(null);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (): Promise<User | null> => {
    try {
      setAuthError(null);
      const user = await loginWithGoogle();
      if (user) {
        setIsGuest(false);
        setGuestUser(null);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
      }
      return user;
    } catch (err: any) {
      const parsed = parseAuthError(err);
      setAuthError(parsed);
      return null;
    }
  };

  const logout = async () => {
    try {
      exitGuestMode();
      await logoutUser();
      setAuthError(null);
    } catch (err: any) {
      console.error("Logout error", err);
    }
  };

  const enterGuestMode = (guestName?: string) => {
    const guest: GuestUser = {
      name: guestName?.trim() || "Consultor Invitado",
      email: "invitado@local.demo",
      isGuest: true
    };
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guest));
    } catch (err) {
      console.error("Error setting guest user in localStorage", err);
    }
    setIsGuest(true);
    setGuestUser(guest);
    setAuthError(null);
  };

  const exitGuestMode = () => {
    try {
      localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (err) {
      console.error("Error removing guest user from localStorage", err);
    }
    setIsGuest(false);
    setGuestUser(null);
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isGuest,
        guestUser,
        loading,
        authError,
        login,
        logout,
        enterGuestMode,
        exitGuestMode,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
