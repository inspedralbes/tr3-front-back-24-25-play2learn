"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import AvatarUserProfile from "@/components/ui/AvatarUserProfile";
import { Clock3, ArrowRight } from "lucide-react";
import socket from "@/services/websockets/socket";

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
}

interface User {
    id: number;
    name: string;
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

export default function WordChain({ participants, game }: { participants: Participant[]; game: Game }) {
    const { isAuthenticated } = useContext(AuthenticatorContext);
    const router = useRouter();
    const { token, user } = useContext(AuthenticatorContext);
    const [currentWord, setCurrentWord] = useState('');
    const [timer, setTimer] = useState(15);
    const [gameStarted, setGameStarted] = useState(false);
    const [lastWord, setLastWord] = useState('');
    const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
    const [players, setPlayers] = useState<Player[]>([]);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [localPlayer, setLocalPlayer] = useState<Player>({} as Player);
    
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        setPlayers(participants.map(participant => ({
            ...participant,
            isActive: false,
            word: '',
            localPoints: 0
        })));

        setLocalPlayer(participants.find(participant => participant.user.id === user?.id) as Player);

        startGame();

        socket.on('turn', data => {
            const {turn, errors} = data;

            setPlayers(prevPlayers =>
                prevPlayers.map((player) => ({
                    ...player,
                    isActive: player.user_id === turn.user_id
                }))
            );

            setIsMyTurn(false);
            if(turn.user_id === user?.id){
                setIsMyTurn(true);
            }
            setTimer(15);
            
        });

        socket.on('word', data => {
            const {word} = data;
            setLastWord(word);
            setCurrentWord('');
        });
        // async function checkWordExists(word: string, language: string) {
        //     const response = await fetch(`/api/openai?word=${word}&language=${language}`);
        //     const data = await response.json();
        //     console.log(data); // { exists: true } o { exists: false }
        // }

        // checkWordExists("arbol", "Español");
        // Limpiar event listeners
        return () => {
            socket.off('turn');
            socket.off('word');
        };
    }, [isAuthenticated, router]);

   

    // Start game with random player
    const startGame = () => {
        socket.emit('getTurn', ({ roomUUID:game.uuid }));
        setGameStarted(true);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStarted && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            if(currentWord.length > 0){
                nextPlayer();
            }else{
                setPlayers(prevPlayers =>
                    prevPlayers.map(player =>
                        ({ ...player, word: "" })
                    )
                );

                setPlayers(prevPlayers =>
                    prevPlayers.map(player =>
                        player.isActive ? { ...player, localPoints: player.localPoints - 1 } : player
                    )
                );
                nextPlayer();
            }
        }
        return () => clearInterval(interval);
    }, [gameStarted, timer]);

    const nextPlayer = () => {
        socket.emit('nextTurnGeneral', { roomUUID: game.uuid, user_id: localPlayer.user_id, points: localPlayer.localPoints });
        socket.emit('lastWord', { roomUUID: game.uuid, word: currentWord });
        setTimer(15);
    };

    const handleSubmitWord = () => {
        if (!currentWord) return;

        const normalizedWord = currentWord.toLowerCase().trim();

        if (usedWords.has(normalizedWord)) {
            alert('¡Esta palabra ya ha sido usada!');
            return;
        }

        if (lastWord && normalizedWord[0] !== lastWord[lastWord.length - 1].toLowerCase()) {
            alert('La palabra debe empezar con la última letra de la palabra anterior');
            return;
        }

        setUsedWords(prev => new Set(prev).add(normalizedWord));
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.isActive ? { ...player, word: currentWord, localPoints: player.localPoints + 1 } : player
            )
        );

        setLocalPlayer(prev => ({
            ...prev,
            localPoints: prev.localPoints + 1
        }));

        
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
        const activePlayerIndex = players.findIndex(p => p.isActive);
        return `${(activePlayerIndex * 360) / players.length - 90}deg`;
    };

    // Get the required starting letters for the current player
    const getStartingLetters = () => {
        if (!lastWord) return '';
        return lastWord[lastWord.length - 1] || '';
    };

    useEffect(() => {
        // Pre-fill the current word with the required starting letters
        const startingLetters = getStartingLetters();
        if (startingLetters && !currentWord) {
            setCurrentWord(startingLetters);
        }
    }, [lastWord, players]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-[500px] h-[500px]">
                {/* Game title */}
                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 text-white text-center">
                    <h1 className="text-4xl font-bold mb-2">Palabras Encadenadas</h1>
                    {gameStarted && localPlayer.rol === 'host' && (
                        <button
                            onClick={startGame}
                            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                        >
                            Comenzar Juego
                        </button>
                    )}
                </div> */}

                {/* Timer in top right corner */}
                {gameStarted && (
                    <div className="absolute top-0 right-0 -translate-y-16 flex items-center gap-2 text-black bg-white bg-opacity-20 px-4 py-2 rounded-full">
                        <Clock3 className="w-6 h-6" />
                        <span className="text-2xl font-bold">{timer}s</span>
                    </div>
                )}

                {/* Center Arrow */}
                {gameStarted && (
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
                        style={{ transform: `translate(-50%, -50%) rotate(${calculateArrowRotation()})` }}
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
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {/* Input field for active player */}
                            {player.isActive && gameStarted && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                                    <input
                                        type="text"
                                        value={currentWord}
                                        onChange={(e) => setCurrentWord(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitWord()}
                                        className="px-4 py-2 rounded-full bg-white text-purple-600 placeholder-purple-400 outline-none border-2 border-white shadow-lg w-48 font-medium"
                                        placeholder="Escribe una palabra..."
                                        {...(isMyTurn ? { autoFocus: true, disabled: false } : { disabled: true })}
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
                            <div className={`relative ${player.isActive ? 'scale-110' : 'scale-100'} transition-all duration-300`}>
                                <img
                                    src={player.user.profile_pic}
                                    alt={player.user.name}
                                    className={`w-16 h-16 rounded-full object-cover border-4 ${player.isActive ? 'border-white' : 'border-transparent'
                                        }`}
                                />
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white font-medium text-sm whitespace-nowrap">
                                    {player.user.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}