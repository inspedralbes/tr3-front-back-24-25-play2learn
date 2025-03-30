"use client";
import { Languages, ChevronRight, Sparkles, Clock, X } from "lucide-react";
import { NavBarContext } from "@/contexts/NavBarContext";
import { useState, useContext, useEffect } from "react";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { useRouter } from "next/navigation";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import Cookies from "js-cookie";

interface Language {
  id: number;
  name: string;
  level: number;
  progress: number;
}

function App() {
  const { selectedLanguage, setSelectedLanguage, showLoader } = useContext(NavBarContext);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [allLanguages, setAllLanguages] = useState<
    { id: number; name: string }[]
  >([]);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [idNewLanguage, setIdNewLanguage] = useState(0);
  const { isAuthenticated, token } = useContext(AuthenticatorContext);
  const router = useRouter();

  const toggleAddLanguage = () => {
    setShowAddLanguage(!showAddLanguage);
  };

  const handleSelectLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    setNewLanguage(e.target.value);
    setIdNewLanguage(parseInt(selectedOption.dataset.id || "0"));
    Cookies.set("lngActive", e.target.value, { expires: 7 });
  };

  const handleSetLanguage = (language: string) => {
    setSelectedLanguage(language);
    Cookies.set("lngActive", language, { expires: 7 });
  };
  
  const handleAddLanguage = () => {
    if (newLanguage === "") return;

    apiRequest(`/user/languages/store`, "POST", { id_language: idNewLanguage })
      .then((response) => {
        if (response.status === "success") {
          setLanguages((prev) => [
            ...prev,
            { id: idNewLanguage, name: newLanguage, level: 1, progress: 0 },
          ]);
          setShowAddLanguage(false);
          handleSetLanguage(newLanguage);
        } else {
          alert("Error adding language.");
        }
      })
      .catch(() => {
        alert("Error adding language.");
      });
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

  const handleChangeLanguage = (language: Language) =>{
    showLoader();
    setSelectedLanguage(language.name)
    socket.emit("lobbie", { token: token || "", language: language.name });
    socket.emit("statsUserLanguage", {token: token, language: language.name});
    Cookies.set("lngActive", language.name, { expires: 7 });
  }

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
            onClick={()=>handleChangeLanguage(language)}
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

        <button
          className="w-full p-4 rounded-lg bg-indigo-800/30 border border-dashed border-indigo-600 hover:bg-indigo-800/50 transition-all flex items-center justify-center text-indigo-400"
          onClick={() => toggleAddLanguage()}
        >
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

      {showAddLanguage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-indigo-900 rounded-xl p-6 w-full max-w-md border border-indigo-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Languages</h2>
              <button
                onClick={toggleAddLanguage}
                className="p-2 rounded-full hover:bg-indigo-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Languages
                </label>
                <select
                  name="id_language"
                  value={newLanguage}
                  onChange={(e) => handleSelectLanguage(e)}
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">Select language</option>
                  {allLanguages.map((lng) => (
                    <option
                      key={`language${lng.id}`}
                      data-id={lng.id}
                      value={lng.name}
                    >
                      {lng.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4">
                <button
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-medium transition-all shadow-lg"
                  onClick={handleAddLanguage}
                >
                  Add Language
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
