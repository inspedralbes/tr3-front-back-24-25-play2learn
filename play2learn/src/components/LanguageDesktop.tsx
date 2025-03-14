"use client";
import { Languages, ChevronRight, Sparkles, Clock } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

function App() {
  const { selectedLanguage, setSelectedLanguage } = useContext(AuthContext);
  
  const languages = [
    { id: 1, name: "Spanish", level: 3, progress: 65 },
    { id: 2, name: "French", level: 1, progress: 20 },
    { id: 3, name: "German", level: 2, progress: 45 },
  ];
  return (
    <div className="hidden md:block md:w-64 bg-indigo-900/50 p-6 border-r border-indigo-700">
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <Languages className="mr-2" size={20} />
        Languages
      </h2>

      <div className="space-y-4">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => setSelectedLanguage(language.name)}
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
  );
}
export default App;
