"use client"
import { useState, useEffect } from 'react';
import { Users, Clock, Star, Trophy, ChevronRight, Play, X, Plus, Search, Loader2 } from 'lucide-react';
import {NavBarContext} from "@/contexts/NavBarContext";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { useRouter } from "next/navigation";
import socket from "@/services/websockets/socket";
import Input from "@/components/ui/Input";

const GameLobby: React.FC = () => {
  interface Language {
    id: number;
    name: string;
  }

  interface LanguageLevel {
    id: number;
    language_id: number;
    language: Language;
    level: string;
  }

  interface User {
    id: number;
    name: string;
    profile_pic: string;
  }

  interface Participant {
    id: number;
    user: User;
    rol: string;
    points: number;
  }

  interface Game {
    id: number;
    id_level_language: number;
    language_level: LanguageLevel;
    uuid: string;
    password: string;
    name: string;
    n_rounds: number;
    max_clues: number;
    max_time: number;
    max_players: number;
    participants: Participant[] | null;
  }

  const [game, setGame] = useState<Game>({
    id: 0,
    id_level_language: 0,
    language_level: {
      id: 0,
      language_id: 0,
      language: {
        id: 0,
        name: "",
      },
      level: "",
    },
    uuid: "",
    password: "",
    name: "",
    n_rounds: 5,
    max_clues: 0,
    max_time: 10,
    max_players: 4,
    participants: null,
  });

  const router = useRouter();
  const { selectedLanguage } = useContext(NavBarContext);
  const { user, isAuthenticated, token } = useContext(AuthenticatorContext);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [waitingRooms, setWaitingRooms] = useState<Game[]>([]);
  const [gameSelected, setGameSelected] = useState<Game>({} as Game);
  const [passwordModal, setPasswordModal] = useState<string>("");
  const [containerLobbies, setContainerLobbies] = useState(false);
  const [showPasswordLobby, setShowPasswordLobby] = useState(false);
  const [languageLevels, setLanguageLevels] = useState<LanguageLevel[]>([]);

  const filteredRooms = waitingRooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.uuid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCreateRoom = () => {
    setShowCreateRoom(!showCreateRoom);
  };

  const showModalJoinLobby = async (room: Game) => {
    setShowPasswordLobby(true);
    setGameSelected(room);
  };

  const   handleCreateRoom = () => {
    socket.emit("setLobbies", { token: token || "", game });
  };

  const handleGameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGame((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePasswordModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordModal(e.target.value);
  };

  const handleJoinLobby = async () => {
    if (!gameSelected.uuid) return;
    if (passwordModal == gameSelected.password) {
      socket.emit("joinRoom", { token: token || "", roomUUID: gameSelected.uuid });
      router.push("/lobby/" + gameSelected.uuid);
    } else {
      console.error("Password incorrect");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    setLanguageLevels([
      {
        id: 1,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "A1",
      },
      {
        id: 2,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "A2",
      },
      {
        id: 3,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "B1",
      },
      {
        id: 4,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "B2",
      },
      {
        id: 5,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "C1",
      },
      {
        id: 6,
        language_id: 1,
        language: {
          id: 1,
          name: "English",
        },
        level: "C2",
      },
    ]);

    socket.emit("lobbie", { token: token || "" });

    socket.on("getLobbies", (data) => {
      setWaitingRooms(data.games);
      setContainerLobbies(true);
    });

    socket.on("loobbieCreated", (data) => {
      setWaitingRooms(data.games);
      router.push("/lobby/" + data.gameCreated.uuid);

    });
    // Limpieza del listener al desmontar el componente
    return () => {
      socket.off("getLobbies");
      socket.off("loobbieCreated");
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    const language = languageLevels.find(
      (level) => level.id === game.id_level_language
    );
    if (language) {
      setGame((prev) => ({
        ...prev,
        language_level: language,
      }));
    }
  }, [game.id_level_language, languageLevels]);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
          Game Lobby: {selectedLanguage}
        </h1>
        <button
          onClick={toggleCreateRoom}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus size={18} className="mr-2" />
          Create Room
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-indigo-400" />
        </div>
        <input
          type="text"
          placeholder="Search rooms by name, game or host..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-indigo-900/30 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-indigo-900 rounded-xl p-6 w-full max-w-md border border-indigo-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create Game Room</h2>
              <button
                onClick={toggleCreateRoom}
                className="p-2 rounded-full hover:bg-indigo-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Name
                </label>
                <Input
                  name="name"
                  placeholder="Enter room name"
                  type="text"
                  onChange={handleGameChange}
                  value={game?.name || ""}
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  name="password"
                  placeholder="Enter password"
                  type="text"
                  onChange={handleGameChange}
                  value={game?.password || ""}
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select
                  name="id_level_language"
                  value={game.id_level_language}
                  onChange={(e) =>
                    setGame((prev) => ({
                      ...prev,
                      id_level_language: parseInt(e.target.value),
                    }))
                  }
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">Select difficulty</option>
                  {languageLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Players
                </label>
                <div className="flex justify-between items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={game.max_players}
                    onChange={handleGameChange}
                    name="max_players"
                    className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 bg-indigo-800 px-2 py-1 rounded-md">
                    {game.max_players}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Clues
                </label>
                <div className="flex justify-between items-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={game.max_clues}
                    onChange={handleGameChange}
                    name="max_clues"
                    className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 bg-indigo-800 px-2 py-1 rounded-md">
                    {game.max_clues}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Max Time Round
                </label>
                <div className="flex justify-between items-center">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={game.max_time}
                    onChange={handleGameChange}
                    name="max_time"
                    className="w-full h-2 bg-indigo-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 bg-indigo-800 px-2 py-1 rounded-md">
                    {game.max_time}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-medium transition-all shadow-lg"
                  onClick={handleCreateRoom}
                >
                  Create & Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room List */}
      {containerLobbies ? (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-indigo-800/40 rounded-xl p-4 md:p-6 border border-indigo-700 hover:bg-indigo-800/60 transition-all"
              >
                <div className="flex flex-col md:flex-row md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{room.name}</h2>
                    <p className="text-indigo-300 mt-1">Max Clues: {room.max_clues}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 md:mt-0">
                    <div className="bg-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>
                        {room.participants?.length}/{room.max_players}
                      </span>
                    </div>
                    <div className="bg-indigo-700 px-3 py-1 rounded-full text-sm flex items-center">
                      <Star size={14} className="mr-1 text-yellow-400" />
                      <span>{room.language_level.level}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-8 text-center font-bold">
                      #{room.participants?.find((p) => p.rol === 'host')?.user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="ml-3 text-sm text-indigo-300">
                      Host: {room.participants?.find((p) => p.rol === 'host')?.user.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between md:space-x-4">
                    <div className="flex items-center text-pink-400">
                      <Clock size={16} className="mr-1" />
                      <span>{room.max_time}s</span>
                    </div>

                    <button
                      className={`px-5 py-2 rounded-lg font-medium flex items-center ${room.participants?.length === room.max_players
                        ? "bg-indigo-700/50 text-indigo-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/30"
                        }`}
                      onClick={() => showModalJoinLobby(room)}
                    >
                      <Play size={16} className="mr-2" />
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-indigo-800/20 rounded-xl p-6 border border-indigo-700 text-center">
              <p className="text-indigo-300">
                No rooms match your search. Try different keywords or create a new
                room!
              </p>
            </div>
          )}
        </div>
      ):
      (
        <>
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin" size={40}/>
        </div>
        </>
      )}
      {/* Create Room Modal */}
      {showPasswordLobby && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-indigo-900 rounded-xl p-6 w-full max-w-md border border-indigo-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create Game Room</h2>
              <button
                onClick={() => setShowPasswordLobby(false)}
                className="p-2 rounded-full hover:bg-indigo-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <Input
                  name="password"
                  placeholder="Enter password"
                  type="text"
                  onChange={handleChangePasswordModal}
                  value={passwordModal}
                  className="w-full p-3 bg-indigo-800/50 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4">
                <button
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg font-medium transition-all shadow-lg"
                  onClick={handleJoinLobby}
                >
                  Create & Start
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Join Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button className="h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <Play size={24} className="text-white" />
        </button>
      </div>

      {/* Leaderboard */}
      <div className="mt-8 bg-indigo-800/20 rounded-xl p-4 md:p-6 border border-indigo-700">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Trophy className="mr-2 text-yellow-400" size={20} />
          Leaderboard
        </h2>

        <div className="space-y-3">
          {[
            { rank: 1, name: "LinguaMaster", points: 1250, avatar: "LM" },
            { rank: 2, name: "WordNinja", points: 980, avatar: "WN" },
            { rank: 3, name: "SyntaxPro", points: 875, avatar: "SP" },
            { rank: 4, name: "VocabKing", points: 720, avatar: "VK" },
            { rank: 5, name: "GrammarGuru", points: 650, avatar: "GG" },
          ].map((player) => (
            <div
              key={player.rank}
              className="flex items-center p-3 bg-indigo-900/30 rounded-lg"
            >
              <div className="w-8 text-center font-bold">#{player.rank}</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-xs font-bold ml-3">
                {player.avatar}
              </div>
              <div className="ml-3 font-medium">{player.name}</div>
              <div className="ml-auto font-bold text-yellow-400">
                {player.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
