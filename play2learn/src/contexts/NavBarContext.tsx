"use client";
import { LoaderComponent } from "@/components/LoaderComponent";
import React, { createContext, useState, ReactNode } from "react";

// Define la interfaz para el valor del contexto, incluyendo la función toggleLoader
interface NavBarContextProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loaderView: boolean;
  setLoaderView: React.Dispatch<React.SetStateAction<boolean>>;
  showLoader: () => void;
  hideLoader: () => void;
}

// Crea el contexto con valores por defecto
export const NavBarContext = createContext<NavBarContextProps>({
  activeSection: "lobby",
  setActiveSection: () => {},
  selectedLanguage: "Castellano",
  setSelectedLanguage: () => {},
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  mobileSidebarOpen: false,
  setMobileSidebarOpen: () => {},
  loaderView: false,
  setLoaderView: () => {},
  showLoader: () => {},
  hideLoader: () => {},
});

interface NavBarProviderProps {
  children: ReactNode;
}

export const NavBarProvider: React.FC<NavBarProviderProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState("lobby");
  const [selectedLanguage, setSelectedLanguage] = useState("Castellano");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loaderView, setLoaderView] = useState(false);

  // Función para cambiar el estado del loader
  const showLoader = () => {
    setLoaderView(true);
  };

  const hideLoader = ()=>{
    setLoaderView(false);
  }

  return (
    <NavBarContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedLanguage,
        setSelectedLanguage,
        mobileMenuOpen,
        setMobileMenuOpen,
        mobileSidebarOpen,
        setMobileSidebarOpen,
        loaderView,
        setLoaderView,
        showLoader,
        hideLoader
      }}
    >
      {/* Siempre se renderizan los children */}
      {children}

      {/* Se superpone el Loader si loaderView es true */}
      {loaderView && (
          <LoaderComponent />
      )}
    </NavBarContext.Provider>
  );
};
