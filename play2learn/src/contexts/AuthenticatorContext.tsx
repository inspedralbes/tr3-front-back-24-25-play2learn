"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { getDefaultAutoSelectFamilyAttemptTimeout } from "net";

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

export const AuthenticatorProvider: React.FC<AuthenticatorProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mètode per processar la URL i autenticar si troba dades
  const handleGoogleAuth = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get("data");

    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        const { user, token } = parsedData;

        if (user && token) {
          authUser(user, token);

          // Eliminar el fragment URL per netejar
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );

          //Redirigir a la pagina principal
          router.push("/");
        }
      } catch (error) {
        console.error(
          "Error en la deserialització de les dades d'autenticació:",
          error
        );
      }
    }
  };

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

      await apiRequest(`/checkAuth`);

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
    handleGoogleAuth();
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
    <AuthenticatorContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        token,
        setToken,
        authUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthenticatorContext.Provider>
  );
};
