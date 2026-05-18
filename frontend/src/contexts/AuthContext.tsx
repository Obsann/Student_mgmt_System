import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("sms_token");
        if (token) {
          const user = await api.getMe();
          setCurrentUser({
            id: user._id,
            username: user.username,
            role: user.role as User["role"],
            name: user.name,
            email: user.email,
            ref_id: user.refId || "",
            avatar: (user as any).avatar,
            coverPhoto: (user as any).coverPhoto,
            verificationQuestions: (user as any).verificationQuestions,
          } as any);
        }
      } catch (err) {
        console.error("Auth init failed", err);
        localStorage.removeItem("sms_token");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();

    // Session expiry detection
    const handleSessionExpired = () => {
      localStorage.removeItem("sms_token");
      setCurrentUser(null);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired as EventListener);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired as EventListener);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    try {
      const { token, user } = await api.login(username, password);
      localStorage.setItem("sms_token", token);
      setCurrentUser({
        id: user._id,
        username: user.username,
        role: user.role as User["role"],
        name: user.name,
        email: user.email,
        ref_id: user.refId || "",
      });
      return null;
    } catch (err: unknown) {
      return err instanceof Error ? err.message : "Invalid username or password";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sms_token");
    setCurrentUser(null);
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("sms_token");
      if (token) {
        const user = await api.getMe();
        setCurrentUser({
          id: user._id,
          username: user.username,
          role: user.role as User["role"],
          name: user.name,
          email: user.email,
          ref_id: user.refId || "",
          avatar: (user as any).avatar,
          coverPhoto: (user as any).coverPhoto,
          verificationQuestions: (user as any).verificationQuestions,
        } as any);
      }
    } catch (err) {
      console.error("Session check failed", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading, isAuthenticated: !!currentUser, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}
