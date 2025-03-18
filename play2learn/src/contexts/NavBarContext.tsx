"use client"
import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define la interfaz para el valor del contexto
interface NavBarContextProps {
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Crea el contexto con un valor por defecto
export const NavBarContext = createContext<NavBarContextProps>({
  activeSection: 'lobby',
  setActiveSection: () => {},
  selectedLanguage: 'Spanish',
  setSelectedLanguage: () => {},
  mobileMenuOpen: false,
  setMobileMenuOpen: () => {},
  mobileSidebarOpen: false,
  setMobileSidebarOpen: () => {},
});

// Define la interfaz para las props del AuthProvider
interface NavBarProviderProps {
  children: ReactNode;
}

export const NavBarProvider: React.FC<NavBarProviderProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('lobby');
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <NavBarContext.Provider value={{ activeSection, selectedLanguage, mobileMenuOpen, mobileSidebarOpen, setActiveSection, setSelectedLanguage, setMobileMenuOpen, setMobileSidebarOpen }}>
      {children}
    </NavBarContext.Provider>
  );
};
