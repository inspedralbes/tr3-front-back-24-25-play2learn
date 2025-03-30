"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import AvatarUserProfile from "@/components/ui/AvatarUserProfile";
import { Crown, LogOut, PlayCircle, Users } from "lucide-react";
import { NavBarContext } from "@/contexts/NavBarContext";


export default function LobbyGameClient() {
  const params = useParams<{ uuid: string }>();
  const { isAuthenticated } = useContext(AuthenticatorContext);
  const router = useRouter();
  const { user, token } = useContext(AuthenticatorContext);

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
    username: string;
    profile_pic: string;
    username: string;
  }

  interface Participant {
    id: number;
    user: User;
    rol: string;
    points: number;
    user_id: number;
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

  const [participants, setParticipants] = useState<Participant[]>([]);
  const {selectedLanguage, hideLoader, showLoader} = useContext(NavBarContext);
  const getHost = () => {
    const host = participants.find((participant) => participant.rol === "host");

    return host ? host.user : null;
  };

  const handleStartGame = () => {
    socket.emit("startGame", { token, roomUUID: params.uuid, language: selectedLanguage });
  };

  const handleLeaveGame = () => {
    socket.emit("leaveGame", { token: token || "", roomUUID: params.uuid, language: selectedLanguage });
    router.push("/");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    socket.emit("getGame", { token: token || "", roomUUID: params.uuid });

    socket.on("playerJoined", (data) => {
      hideLoader();
      setParticipants(data.game.participants || []);
    });

    socket.on("gameDeleted", (data) => {
      hideLoader();
      setParticipants([]);
      router.push("/");
    });

    socket.on("gameStarted", (data) => {
      hideLoader();
      if (data.status === "success") {
        router.push(`/games/${params.uuid}`);
      }
    });

    // Limpiar event listeners
    return () => {
      socket.off("playerJoined");
      socket.off("gameDeleted");
      socket.off("gameStarted");
    };
  }, [isAuthenticated, router]);

    function goToTranslate() {
        socket.emit('startGame', {token: token || "", roomUUID: params.uuid});
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="hidden sm:inline">Sala de Espera</span>
            <span className="sm:hidden">Lobby</span>
          </h1>
          <button
            className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg 
            flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline" onClick={handleLeaveGame}>
              Salir del Juego
            </span>
            <span className="sm:hidden" onClick={handleLeaveGame}>
              Salir
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-xl">
          {/* Players List */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
              Jugadores Conectados ({participants.length})
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {participants.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-3 sm:p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span>
                      <AvatarUserProfile
                        key={player.id}
                        name={player.user.name}
                        profile_pic={player.user.profile_pic}
                        pos_name="right"
                        host={player.rol === "host"}
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          {participants.some(
            (participant) =>
              participant.user.id === user?.id && participant.rol === "host"
          ) && (
            <div className="flex justify-center">
              <button
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl flex items-center 
                justify-center gap-2 transform hover:scale-105 transition-all shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleStartGame}
              >
                <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Iniciar Partida
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
