"use client";
import {
  Globe,
  Users,
  TowerControl as GameController,
  Trophy,
  BookOpen,
  Settings,
  LogOut,
  User2,
} from "lucide-react";
import { useContext } from "react";
import { NavBarContext } from "@/contexts/NavBarContext";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import Link from "next/link";

function App() {
  const { activeSection, setActiveSection } = useContext(NavBarContext);
  const { logout } = useContext(AuthenticatorContext);
  
  const handleLogout = async() => {
    const response = await apiRequest("/auth/logout");

    if (response.status === "success") {
      logout(); 
    }
1  }

  return (
    <div className="hidden md:flex md:w-20 bg-indigo-950 flex-col items-center py-8 border-r border-indigo-700">
      <div className="mb-10">
          <img className="h-12 w-12 text-white" src="/img/logo.png" />
      </div>

      <nav className="flex flex-col items-center space-y-8 flex-1">
        <Link href="/">
          <button
            onClick={() => setActiveSection("lobby")}
            className={`p-3 rounded-xl transition-all ${
              activeSection === "lobby"
                ? "bg-purple-700 text-white"
                : "text-indigo-400 hover:bg-indigo-800"
            }`}
          >
            <Users size={24} />
          </button>
        </Link>
        {/* Ocultar por ahora el modo individual */}
        {/* <button 
            onClick={() => setActiveSection('games')}
            className={`p-3 rounded-xl transition-all ${activeSection === 'games' ? 'bg-purple-700 text-white' : 'text-indigo-400 hover:bg-indigo-800'}`}
          >
            <GameController size={24} />
          </button> */}
        <Link href="/profile">
          <button
            onClick={() => setActiveSection("profile")}
            className={`p-3 rounded-xl transition-all ${
              activeSection === "profile"
                ? "bg-purple-700 text-white"
                : "text-indigo-400 hover:bg-indigo-800"
            }`}
          >
            <Trophy size={24} />
          </button>
        </Link>
        <Link href="/me">
          <button
            onClick={() => setActiveSection("me")}
            className={`p-3 rounded-xl transition-all ${
              activeSection === "me"
                ? "bg-purple-700 text-white"
                : "text-indigo-400 hover:bg-indigo-800"
            }`}
          >
            <User2 size={24} />
          </button>
        </Link>
      </nav>

      <button 
      onClick={() => handleLogout()}
      className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-800 transition-all mt-auto"
        >
        <LogOut size={24} />
      </button>
    </div>
  );
}
export default App;
