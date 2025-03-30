"use client";
import { useState, useContext, useEffect } from "react";
import { Menu, Languages, Users, TowerControl as GameController, Trophy, BookOpen, Settings, LogOut, ChevronRight, Sparkles, Clock, X, User2 } from "lucide-react";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { useRouter } from "next/navigation";
import { NavBarContext } from "@/contexts/NavBarContext";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import Cookies from "js-cookie";
import Link from "next/link";

interface Language {
  id: number;
  name: string;
  level: number;
  progress: number;
}

function App() {
  const { selectedLanguage, setSelectedLanguage, showLoader, activeSection, setActiveSection } = useContext(NavBarContext);
  const { isAuthenticated, token, logout } = useContext(AuthenticatorContext);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [allLanguages, setAllLanguages] = useState<
    { id: number; name: string }[]
  >([]);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const response = await apiRequest("/auth/logout");

    if (response.status === "success") {
      logout();
    }
  };

  const toggleAddLanguage = () => {
    toggleMobileSidebar();
    setShowAddLanguage(!showAddLanguage);
  };

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      setMobileSidebarOpen(false);
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSidebar = () => {
    if (!mobileSidebarOpen) {
      setMobileMenuOpen(false);
    }
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleChangeLanguage = (language: Language) => {
    showLoader();
    setSelectedLanguage(language.name)
    socket.emit("lobbie", { token: token || "", language: language.name });
    socket.emit("statsUserLanguage", { token: token, language: language.name });
  }



  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setMobileSidebarOpen(false);
  };

  const handleSetLanguage = (language: string) => {
    setSelectedLanguage(language);
    Cookies.set("lngActive", language, { expires: 7 });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }
    const fetchLanguages = async () => {
      const response = await apiRequest(`/user/languages`);

      if (response.status === "success") {
        const fetchedLanguages: Language[] = response.statsLanguages.map(
          (lng: any) => ({
            id: lng.language.id,
            name: lng.language.name,
            level: lng.level.level,
            progress: lng.experience,
          })
        );
        setLanguages(fetchedLanguages);

        const lngActive = Cookies.get("lngActive") || null;
        console.log(lngActive);
        console.log(
          response.statsLanguages.some(
            (lng: any) => lng.language.name === lngActive
          )
        );
        if (
          lngActive &&
          response.statsLanguages.some(
            (lng: any) => lng.language.name === lngActive
          )
        ) {
          handleSetLanguage(lngActive);
        } else {
          handleSetLanguage(fetchedLanguages[0].name);
        }
      }
    };

    fetchLanguages();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (languages.length == 0) return;

    const fetchNewLanguages = async () => {
      const response = await apiRequest(`/languages`);
      if (response.status === "success") {
        const newLng = response.languages
          .filter(
            (lng: any) =>
              !languages.some((language) => language.name === lng.name)
          )
          .map((lng: any) => ({ id: lng.id, name: lng.name }));
        setAllLanguages(newLng);
        console.log(newLng);
      }
    };

    fetchNewLanguages();
  }, [languages]);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-950 p-4 flex justify-between items-center border-b border-indigo-700">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 mr-3 rounded-lg bg-indigo-800/50"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg bg-indigo-800/50 flex items-center"
        >
          <Languages size={20} className="mr-2" />
          <span>{selectedLanguage}</span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-950 border-b border-indigo-700 absolute top-[68px] left-0 right-0 z-50">
          <nav className="flex flex-col p-4">
            <Link href="/">
              <button
                onClick={() => handleNavClick("lobby")}
                className={`p-3 mb-2 rounded-xl flex items-center transition-all ${activeSection === "lobby"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
                  }`}
              >
                <Users size={20} className="mr-3" />
                <span>Game Lobby</span>
              </button>
            </Link>
            <Link href="/profile">
              <button
                onClick={() => handleNavClick("profile")}
                className={`p-3 mb-2 rounded-xl flex items-center transition-all ${activeSection === "profile"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
                  }`}
              >
                <Trophy size={20} className="mr-3" />
                <span>Profile</span>
              </button>
            </Link>
            <Link href="/me">
              <button
                onClick={() => handleNavClick("me")}
                className={`p-3 mb-2 rounded-xl flex items-center transition-all ${activeSection === "me"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
                  }`}
              >
                <User2 size={20} className="mr-3"/>
                <span>Me</span>
              </button>
            </Link>
            <button className="p-3 rounded-xl flex items-center text-indigo-400 hover:bg-indigo-800 transition-all"
              onClick={() => handleLogout()}
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Mobile Language Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-indigo-900/98 absolute top-[68px] right-0 bottom-0 left-0 z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Languages className="mr-2" size={20} />
              Languages
            </h2>
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg bg-indigo-800/50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {languages.map((language) => (
              <button
                key={language.id}
                onClick={() => {
                  setSelectedLanguage(language.name);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full p-4 rounded-lg flex flex-col transition-all ${selectedLanguage === language.name
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                  : "bg-indigo-800/50 hover:bg-indigo-800"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{language.name}</span>
                  <span className="bg-indigo-700 text-xs px-2 py-1 rounded-full">
                    Lvl {language.level}
                  </span>
                </div>

                <div className="mt-3 w-full bg-indigo-950/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                    style={{ width: `${language.progress}%` }}
                  ></div>
                </div>
              </button>
            ))}

            <button className="w-full p-4 rounded-lg bg-indigo-800/30 border border-dashed border-indigo-600 hover:bg-indigo-800/50 transition-all flex items-center justify-center text-indigo-400"
              onClick={toggleAddLanguage}
            >
              <span className="mr-2">Añadir idioma</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default App;
