"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  profile_pic: string;
}

interface AuthenticatorContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  authUser: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthenticatorContext = createContext<AuthenticatorContextProps>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  token: null,
  setToken: () => {},
  authUser: () => {},
  logout: () => {},
  checkAuth: () => {},
});

// Define la interfaz para las props del AuthenticatorProvider
interface AuthenticatorProviderProps {
  children: ReactNode;
}

export const AuthenticatorProvider: React.FC<AuthenticatorProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const authToken = Cookies.get("authToken");
      const authUserStr = Cookies.get("authUser");

      if (!authToken || !authUserStr) {
        logout();
        return;
      }

      const user = JSON.parse(authUserStr);
      
      if (!user || !user.id) {
        logout();
        return;
      }

      setUser(user);
      setToken(authToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error checking auth:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const authUser = async (user: User, token: string) => {
    try {
      setUser(user);
      setIsAuthenticated(true);
      setToken(token);
      Cookies.set("authToken", token);
      Cookies.set("authUser", JSON.stringify(user));
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    Cookies.remove("authToken");
    Cookies.remove("authUser");
    setIsLoading(false);
  };

  if (isLoading) {
    return null; // o un componente de carga si lo prefieres
  }

  return (
    <AuthenticatorContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, token, setToken, authUser, logout, checkAuth }}>
      {children}
    </AuthenticatorContext.Provider>
  );
};