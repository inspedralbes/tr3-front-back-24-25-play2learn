"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { NavBarContext } from "@/contexts/NavBarContext";
import { ArrowRight, Crown, LogOut, Medal, Trophy, Users } from "lucide-react";
import AvatarUserProfile from "@/components/ui/AvatarUserProfile";
import { LoaderComponent } from "@/components/LoaderComponent";

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

function LeaderGame({ game, participants }: { game: Game; participants: Participant[] }) {
    const { isAuthenticated, token } = useContext(AuthenticatorContext);
    const router = useRouter();
    const [participantsOrderedByPoints, setParticipantsOrderedByPoints] = useState<Participant[]>([]);
    const { selectedLanguage, setSelectedLanguage } = useContext(NavBarContext);


    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        apiRequest("/games/lobby/" + game.uuid, "GET")
            .then((response) => {
                setParticipantsOrderedByPoints(response.game.participants.sort((a, b) => b.points - a.points));
            })

    }, [isAuthenticated, router]);

    const handleNextGame = () => {
        socket.emit('nextGame', { roomUUID: game.uuid, language: selectedLanguage, token: token })
    };

    const RankBadge = ({ position }: { position: number }) => {
        const getBadgeStyle = (pos: number) => {
            switch (pos) {
                case 1:
                    return "bg-yellow-500 text-yellow-900";
                case 2:
                    return "bg-gray-300 text-gray-700";
                case 3:
                    return "bg-amber-600 text-amber-900";
                default:
                    return "bg-white/10 text-white/80";
            }
        };

        const getBadgeIcon = (pos: number) => {
            switch (pos) {
                case 1:
                    return <Crown className="w-4 h-4" />;
                case 2:
                    return <Trophy className="w-4 h-4" />;
                case 3:
                    return <Medal className="w-4 h-4" />;
                default:
                    return pos;
            }
        };

        return (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getBadgeStyle(position)}`}>
                {getBadgeIcon(position)}
            </div>
        );
    };

    if (!game.id || participantsOrderedByPoints.length === 0) {
        return <LoaderComponent />;
    } else {
        return (
            // <div>
            //     <h1>LeaderGame</h1>
            //     <p>{game.name}</p>

            //     {participantsOrderedByPoints.map((participant) => (
            //         <div key={participant.id}>
            //             <p>{participant.user.name}</p>
            //             <p>{participant.rol}</p>
            //             <p>{participant.points}</p>
            //         </div>
            //     ))}

            //     <button onClick={handleNextGame}>Next Game</button>
            // </div>

            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-2 rounded-full bg-white/10 backdrop-blur-lg mb-4">
                            <Trophy className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Tabla de Líderes</h1>
                        <p className="text-white/80">Compite por la gloria y el primer lugar</p>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                        <div className="space-y-4">
                            {participantsOrderedByPoints.map((player, index) => (
                                <div
                                    key={player.id}
                                    className="transform transition-all duration-300 hover:scale-102 hover:bg-white/15"
                                >
                                    <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                        <RankBadge position={index + 1} />

                                        <div className="flex-shrink-0">
                                            <img
                                                src={player.user.profile_pic}
                                                alt={player.user.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                            />
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-semibold text-white">
                                                    {player.user.name}
                                                </span>
                                                {player.rol === "host" && (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400">
                                                        Host
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-white/60 text-sm">
                                                {player.points.toLocaleString()} puntos
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 text-2xl font-bold text-white/90">
                                            #{index + 1}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Next Game Button */}
                        <div className="mt-8 flex justify-center">
                            <button
                                className="group relative cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-900"
                                onClick={handleNextGame}
                            >
                                Siguiente Juego
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LeaderGame;