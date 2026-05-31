import React, { createContext, useState, useEffect } from "react";
import api, { setAccessToken, registerAuthCallbacks } from "../lib/api";

export interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  setAccessTokenState: (token: string | null) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessTokenState, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
    setAccessToken(accessToken);
    setAccessTokenState(accessToken);
    setUser(userData);
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        // Request backend logout to invalidate refresh token
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Backend logout error (proceeding with local logout):", err);
    } finally {
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
      setAccessTokenState(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (storedRefreshToken) {
        try {
          // Request a new access token
          const refreshRes = await api.post("/api/auth/refresh-token", {
            refreshToken: storedRefreshToken,
          });
          const newAccessToken = refreshRes.data?.data?.accessToken;
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            setAccessTokenState(newAccessToken);

            // Fetch user info using the new access token
            const meRes = await api.get("/api/auth/me");
            const userData = meRes.data?.data;
            if (userData) {
              setUser(userData);
            } else {
              throw new Error("Unable to fetch user info");
            }
          } else {
            throw new Error("No token returned");
          }
        } catch (error) {
          console.error("Session restoration error:", error);
          localStorage.removeItem("refreshToken");
          setAccessToken(null);
          setAccessTokenState(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    // Synchronize API module callbacks with React state
    registerAuthCallbacks(
      () => {
        localStorage.removeItem("refreshToken");
        setAccessToken(null);
        setAccessTokenState(null);
        setUser(null);
      },
      (newToken) => {
        setAccessTokenState(newToken);
      }
    );

    initializeAuth();
  }, []);

  const value = {
    user,
    accessToken: accessTokenState,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setAccessTokenState,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
