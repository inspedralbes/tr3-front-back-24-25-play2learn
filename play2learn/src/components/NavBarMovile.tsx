"use client";
import { useState } from "react";
import { Menu, Globe, Languages, Users, TowerControl as GameController, Trophy, BookOpen, Settings, LogOut, ChevronRight, Sparkles, Clock, X } from "lucide-react";

function App() {
  const [activeSection, setActiveSection] = useState("lobby");
  const [selectedLanguage, setSelectedLanguage] = useState("Spanish");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const languages = [
    { id: 1, name: "Spanish", level: 3, progress: 65 },
    { id: 2, name: "French", level: 1, progress: 20 },
    { id: 3, name: "German", level: 2, progress: 45 },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    setMobileSidebarOpen(false);
  };

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
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
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
            <button
              onClick={() => handleNavClick("lobby")}
              className={`p-3 mb-2 rounded-xl flex items-center transition-all ${
                activeSection === "lobby"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
              }`}
            >
              <Users size={20} className="mr-3" />
              <span>Game Lobby</span>
            </button>
            <button
              onClick={() => handleNavClick("games")}
              className={`p-3 mb-2 rounded-xl flex items-center transition-all ${
                activeSection === "games"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
              }`}
            >
              <GameController size={20} className="mr-3" />
              <span>Games</span>
            </button>
            <button
              onClick={() => handleNavClick("profile")}
              className={`p-3 mb-2 rounded-xl flex items-center transition-all ${
                activeSection === "profile"
                  ? "bg-purple-700 text-white"
                  : "text-indigo-400 hover:bg-indigo-800"
              }`}
            >
              <Trophy size={20} className="mr-3" />
              <span>Profile</span>
            </button>
            <button className="p-3 mb-2 rounded-xl flex items-center text-indigo-400 hover:bg-indigo-800 transition-all">
              <BookOpen size={20} className="mr-3" />
              <span>Dictionary</span>
            </button>
            <button className="p-3 mb-2 rounded-xl flex items-center text-indigo-400 hover:bg-indigo-800 transition-all">
              <Settings size={20} className="mr-3" />
              <span>Settings</span>
            </button>
            <button className="p-3 rounded-xl flex items-center text-indigo-400 hover:bg-indigo-800 transition-all">
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Mobile Language Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden bg-indigo-900/90 absolute top-[68px] right-0 bottom-0 left-0 z-50 p-6 overflow-y-auto">
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
                className={`w-full p-4 rounded-lg flex flex-col transition-all ${
                  selectedLanguage === language.name
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

            <button className="w-full p-4 rounded-lg bg-indigo-800/30 border border-dashed border-indigo-600 hover:bg-indigo-800/50 transition-all flex items-center justify-center text-indigo-400">
              <span className="mr-2">Add Language</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-8 p-4 bg-indigo-800/30 rounded-lg border border-indigo-700">
            <h3 className="font-medium flex items-center">
              <Sparkles className="mr-2 text-yellow-400" size={16} />
              Daily Streak
            </h3>
            <div className="flex items-center mt-2">
              <div className="text-2xl font-bold text-yellow-400">7</div>
              <div className="ml-2 text-xs text-indigo-300">days</div>
              <div className="ml-auto flex items-center text-xs text-indigo-300">
                <Clock size={14} className="mr-1" />
                <span>4h left</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default App;
