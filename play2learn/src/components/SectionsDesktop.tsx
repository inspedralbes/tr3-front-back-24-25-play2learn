"use client";
import {
  Globe,
  Users,
  TowerControl as GameController,
  Trophy,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { NavBarContext } from "@/contexts/NavBarContext";
import { useContext } from "react";
import Link from "next/link";

function App() {
  const { activeSection, setActiveSection } = useContext(NavBarContext);

  return (
    <div className="hidden md:flex md:w-20 bg-indigo-950 flex-col items-center py-8 border-r border-indigo-700">
      <div className="mb-10">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
          <Globe className="h-6 w-6 text-white" />
        </div>
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
        <button className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-800 transition-all">
          <BookOpen size={24} />
        </button>
        <button className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-800 transition-all">
          <Settings size={24} />
        </button>
      </nav>

      <button className="p-3 rounded-xl text-indigo-400 hover:bg-indigo-800 transition-all mt-auto">
        <LogOut size={24} />
      </button>
    </div>
  );
}
export default App;
