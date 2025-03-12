"use client"
import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define la interfaz para el valor del contexto
interface AuthContextProps {
  activeSection: string;
  selectedLanguage: string;
  mobileMenuOpen: boolean;
  mobileSidebarOpen: boolean;
}

// Crea el contexto con un valor por defecto
export const AuthContext = createContext<AuthContextProps>({
  activeSection: 'lobby',
  selectedLanguage: 'Spanish',
  mobileMenuOpen: false,
  mobileSidebarOpen: false,
});

// Define la interfaz para las props del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState('lobby');
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ activeSection: 'lobby', selectedLanguage: 'Spanish', mobileMenuOpen: false, mobileSidebarOpen: false }}>
      {children}
    </AuthContext.Provider>
  );
};
