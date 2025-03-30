"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import AvatarUserProfile from "@/components/ui/AvatarUserProfile";
import { Clock3, ArrowRight, User, User2, Star } from "lucide-react";
import socket from "@/services/websockets/socket";
import next from "next";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { LoaderComponent } from "@/components/LoaderComponent";

interface Participant {
    id: number;
    user_id: number;
    user: User;
    rol: string;
    points: number;
}

interface Player extends Participant {
    isActive: boolean;
    word: string;
    localPoints: number;
    time: number;
}

interface User {
    id: number;
    name: string;
    username: string;
    profile_pic: string;
}

interface LanguageLevel {
    id: number;
    language_id: number;
    language: Language;
    level: string;
}

interface Language {
    id: number;
    name: string;
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

export default function WordChain({
    participants,
    game,
}: {
    participants: Participant[];
    game: Game;
}) {
    const { isAuthenticated, token, user } = useContext(AuthenticatorContext);
    const router = useRouter();
    const [currentWord, setCurrentWord] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [lastWord, setLastWord] = useState("");
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    const [players, setPlayers] = useState<Player[]>([]);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [timer, setTimer] = useState<number>();
    const [points, setPoints] = useState<number>(0);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        //start game
        socket.emit("getTurnWordChain", { roomUUID: game.uuid });
        setGameStarted(true);

        //get turn player
        socket.on("turnWordChain", (data) => {
            const { turn, players, errors } = data;

            console.log("--------------------TURN WORD CHAIN-------------------")
            console.log(turn);

            setPlayers(players);

            setIsMyTurn(false);
            if (turn.user_id === user?.id) {
                setIsMyTurn(true);
            }
        });

        //get player word
        socket.on("word", (data) => {
            const { word } = data;
            setLastWord(word);
            setCurrentWord("");
        });

        socket.on("roomNotFound", data => {
            console.log("room not found");
            router.push("/");
        })
        return () => {
            socket.off("turnWordChain");
            socket.off("word");
        };
    }, [isAuthenticated, router]);

    const [hasExecutedNextPlayer, setHasExecutedNextPlayer] = useState(false);

    useEffect(() => {
        console.log("---------------------------PLAYERS---------------------------")

        if (players.length === 0 || !players) {
            return;
        }

        let timePlayer = players.find((p) => p.isActive)?.time

        let countFinished = 0;
        players.forEach(p => {
            if (p.time === 0) {
                countFinished++;
            }
        });

        if (countFinished === players.length) {
            if (isMyTurn) {
                apiRequest("/game/store/stats", "POST", {players: players})
                    .then((response) => {
                        console.log(response)
                        socket.emit("showLeader", { token: token, roomUUID: game.uuid });
                        console.log("todos terminaron")
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
            return;
        }

        if (timePlayer && (timePlayer === 0 || timePlayer < 0)) {
            console.log("no tine tiempo", timer)
            if (isMyTurn) {
                setPoints((prevPoints) => prevPoints - 50)
                //emitimos los datos del que tiene el turno para guardarlo
                socket.emit("nextTurnWordChain", {
                    roomUUID: game.uuid,
                    points: points,
                    timeRemaining: 0,
                    playerWord: currentWord
                });
            }
            return;
        }

        console.error(players.find((p) => p.isActive)?.time)
        setTimer(players.find((p) => p.isActive)?.time);
    }, [players])


    useEffect(() => {
        let interval: NodeJS.Timeout;
        // if(!timer || timer === undefined)
        // {
        //     return;
        // }

        if (gameStarted && (timer && timer > 0)) {
            interval = setInterval(() => {
                setTimer((prev) => prev || 0 - 1);
            }, 1000);
        } else if (timer === 0) {
            console.log("tiempo acabado")
            if (isMyTurn) {
                nextPlayer();
            }
            return;
        }
        return () => clearInterval(interval);
    }, [gameStarted, timer, hasExecutedNextPlayer]);


    const nextPlayer = () => {
        //emit the word writted
        socket.emit("lastWord", {
            roomUUID: game.uuid,
            word: currentWord,
        });

        //emitimos los datos del que tiene el turno para guardarlo
        socket.emit("nextTurnWordChain", {
            roomUUID: game.uuid,
            points: points,
            timeRemaining: timer,
            playerWord: currentWord
        });
    };

    const handleSubmitWord = () => {
        if (!currentWord) return;

        const normalizedWord = currentWord.toLowerCase().trim();

        if (usedWords.has(normalizedWord)) {
            alert("¡Esta palabra ya ha sido usada!");
            return;
        }

        if (
            lastWord &&
            normalizedWord[0] !== lastWord[lastWord.length - 1].toLowerCase()
        ) {
            alert(
                "La palabra debe empezar con la última letra de la palabra anterior"
            );
            return;
        }

        setUsedWords((prev) => new Set(prev).add(normalizedWord));
        setPoints(prevPoints => prevPoints + 100);

        nextPlayer();
    };

    const calculatePosition = (index: number, total: number) => {
        const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // Start from top
        const radius = 150;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return { x, y };
    };

    const calculateArrowRotation = () => {
        const activePlayerIndex = players.findIndex((p) => p.isActive);
        return `${(activePlayerIndex * 360) / players.length - 90}deg`;
    };

    // Get the required starting letters for the current player
    const getStartingLetters = () => {
        if (!lastWord) return "";
        return lastWord[lastWord.length - 1] || "";
    };

    useEffect(() => {
        // Pre-fill the current word with the required starting letters
        const startingLetters = getStartingLetters();
        if (startingLetters && !currentWord) {
            setCurrentWord(startingLetters);
        }
    }, [lastWord, players]);

    if (!players || participants.length === 0) {
        return <LoaderComponent />;
    } else {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative w-[500px] h-[500px]">

                    {/* Timer in top right corner */}
                    {gameStarted && isMyTurn && (
                        <>
                            <div className="absolute top-0 left-0 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <User2 className="w-6 h-6" />
                                <span>Tu turno</span>
                            </div>

                            <div className="absolute top-0 left-50 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                {/* <Clock3 className="w-6 h-6" />
              <span className="text-2xl font-bold">{timer}s</span> */}
                                <Star className="w-6 h-6" />
                                <span>
                                    {points}
                                </span>
                            </div>

                            <div className="absolute top-0 right-0 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <Clock3 className="w-6 h-6" />
                                <span className="text-2xl font-bold">
                                    {timer}s
                                </span>
                            </div>
                        </>
                    )}

                    {gameStarted && !isMyTurn && (
                        <>
                            <div className="absolute top-0 left-0 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                {/* <Clock3 className="w-6 h-6" />
              <span className="text-2xl font-bold">{timer}s</span> */}
                                <User2 className="w-6 h-6" />
                                <span>
                                    Turno de {players.find((p) => p.isActive)?.user.username}
                                </span>
                            </div>

                            <div className="absolute top-0 left-50 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                {/* <Clock3 className="w-6 h-6" />
              <span className="text-2xl font-bold">{timer}s</span> */}
                                <Star className="w-6 h-6" />
                                <span>
                                    {points}
                                </span>
                            </div>

                            <div className="absolute top-0 right-0 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                                <Clock3 className="w-6 h-6" />
                                <span className="text-2xl font-bold">
                                    {timer}s
                                </span>
                            </div>
                        </>
                    )}

                    {/* Center Arrow */}
                    {gameStarted && (
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
                            style={{
                                transform: `translate(-50%, -50%) rotate(${calculateArrowRotation()})`,
                            }}
                        >
                            <ArrowRight className="w-16 h-16 text-white animate-pulse" />
                        </div>
                    )}

                    {/* Players */}
                    {players.map((player, index) => {
                        const pos = calculatePosition(index, players.length);
                        return (
                            <div
                                key={player.id}
                                className="absolute transition-all duration-500"
                                style={{
                                    left: `${pos.x + 250}px`,
                                    top: `${pos.y + 250}px`,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                {/* Input field for active player */}
                                {player.isActive && gameStarted && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                                        <input
                                            type="text"
                                            value={currentWord}
                                            onChange={(e) => setCurrentWord(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSubmitWord()}
                                            className="px-4 py-2 rounded-full bg-white text-purple-600 placeholder-purple-400 outline-none border-2 border-white shadow-lg w-48 font-medium"
                                            placeholder="Escribe una palabra..."
                                            {...(isMyTurn
                                                ? { autoFocus: true, disabled: false }
                                                : { disabled: true })}
                                        />
                                    </div>
                                )}

                                {/* Word bubble */}
                                {player.word && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg px-3 py-1 text-purple-600 font-medium shadow-lg min-w-[80px] text-center">
                                        {player.word}
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
                                    </div>
                                )}

                                {/* Player avatar */}
                                <div
                                    className={`relative ${player.isActive ? "scale-110" : "scale-100"
                                        } transition-all duration-300`}
                                >
                                    <img
                                        src={player.user.profile_pic}
                                        alt={player.user.username}
                                        className={`w-16 h-16 rounded-full object-cover border-4 ${player.isActive ? "border-white" : "border-transparent"
                                            }`}
                                    />
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white font-medium text-sm whitespace-nowrap">
                                        {player.user.username}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

}
