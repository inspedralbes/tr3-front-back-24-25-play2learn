"use client";

import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";
import Link from "next/link"
import {useContext, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslation} from "@/hooks/useTranslation";
import socket from "@/services/websockets/socket";
import {apiRequest} from "@/services/communicationManager/apiRequest";
import {auto} from "openai/_shims/registry";
import {Clock3} from "lucide-react";

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
    user_id: number
    user: User;
    rol: string;
    points: number;
}

interface Player extends Participant {
    isActive: boolean;
    localPoints: number;
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


function TranslationGameComponent({participants, game}: { participants: Participant[]; game: Game }) {

    const router = useRouter();
    const {t} = useTranslation();
    const params = useParams<{ uuid: string }>();
    const {isAuthenticated, token, user} = useContext(AuthenticatorContext);
    const [players, setPlayers] = useState<Player[]>([]);
    const [room, setRoom] = useState<Game>()
    const [acertado, setAcertado] = useState(false);
    const [respuesta, setRespuesta] = useState("");
    const [palabraActual, setPalabraActual] = useState('');
    const [wordTranslate, setWordTranslate] = useState('');
    const [wordGenerated, setWordGenerated] = useState(false);
    const [canWrite, setCanWrite] = useState(false); // Si el usuario puede escribir
    const [localPlayer, setLocalPlayer] = useState<Player>({} as Player);
    const [timer, setTimer] = useState(15);
    const [gameStarted, setGameStarted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    function nextPlayer() {
        const currentIndex = players.findIndex(p => p.isActive);
        if (currentIndex === -1) {
            console.warn("No se encontró un jugador activo para calcular el siguiente turno.");
            return;
        }
        // Calcula el índice del siguiente jugador (rotación circular)
        const nextIndex = (currentIndex + 1) % players.length;
        const nextPlayer = players[nextIndex];

        console.log("Turno pasado a:", nextPlayer);

        socket.emit('nextTurnGeneral', {
            roomUUID: game.uuid,
            user_id: nextPlayer.user_id,
            points: nextPlayer.localPoints
        });
        setTimer(15);
    };

    const startGame = () => {
        socket.emit('getTurn', ({roomUUID: params.uuid}));
        setGameStarted(true);
    };


    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        setPlayers(participants.map(participant => ({
            ...participant,
            isActive: false,
            localPoints: 0
        })));


        setRoom(game);

        setLocalPlayer(participants.find(participant => participant.user.id === user?.id) as Player);
        startGame();

        socket.on('turn', (data) => {
            console.log("TURNOS", data);
            const {turn, errors} = data;

            setPlayers(prevPlayers =>
                prevPlayers.map((player) => ({
                    ...player,
                    isActive: player.user_id === turn.user_id
                }))
            );


            setCanWrite(false);
            if (turn.user_id === user?.id) {
                setCanWrite(true);
            }
            setTimer(15)
        });

        socket.on('wordRoom', (data) => {
            console.log("Evento wordRoom recibido con:", data);
            if (data && data.word) {
                setPalabraActual(prev => {
                    console.log("Palabra actual antes de actualizar:", prev);
                    console.log("Nueva palabra recibida:", data.word);
                    return data.word;
                });
                //setPalabraActual(data.word);
            } else {
                console.warn("No se recibió una palabra válida.");
            }
        });

        socket.on('translateClient', (data) => {
            console.log("Chat", data);
            if (data.word_translate && data.word_translate.toLowerCase() === data.word) {
                setAcertado(true);
                setWordTranslate(data.word_translate);
                setRespuesta('');
                console.log("¡Acertado!");

                socket.emit('randomWord', {uuid: params.uuid});

                // Actualización de puntos y siguiente turno
                setPlayers(prevPlayers =>
                    prevPlayers.map(player =>
                        player.isActive ? {...player, localPoints: player.localPoints + 1} : player
                    )
                );

                setLocalPlayer(prev => ({
                    ...prev,
                    localPoints: prev.localPoints + 1
                }));

                setAcertado(false)
            } else {
                // Add error message when translation is incorrect
                setErrorMessage("¡Te has equivocado! Intenta de nuevo.");

                // Clear error message after 3 seconds
                setTimeout(() => {
                    setErrorMessage(null);
                }, 3000);

                console.log("Respuesta incorrecta o palabra no encontrada");
            }
        });


        return () => {
            socket.off('wordRoom');
            socket.off('translateClient');
            socket.off('turn')
        };

    }, [isAuthenticated, router]);


    useEffect(() => {
        const host = players.find(p => p.rol === 'host');
        if (host && !palabraActual) {
            socket.emit('randomWord', {uuid: params.uuid});
            setWordGenerated(true)
        }
    }, [players, palabraActual]);

    useEffect(() => {

        let interval: NodeJS.Timeout;
        if (gameStarted && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            if (palabraActual.length > 0) {
                nextPlayer();
            } else {
                setPlayers(prevPlayers =>
                    prevPlayers.map(player =>
                        ({...player, word: ""})
                    )
                );

                setPlayers(prevPlayers =>
                    prevPlayers.map(player =>
                        player.isActive ? {...player, localPoints: player.localPoints - 1} : player
                    )
                );
                nextPlayer();
            }
        }

        return () => clearInterval(interval);
    }, [gameStarted, timer, palabraActual])

    const inputResolve = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("WORD", respuesta.toLowerCase())
        const language = "de"
        try {
            //const responseApi = await fetch(`/api/openai-translate?word=${respuesta.toLowerCase()}&language=${language}`);
            const jsonData = {
                word: respuesta.toLowerCase(),
                source: auto,
                target: language,
            }

            const response = await apiRequest('/lara/translate', "POST", jsonData);

            const data = await response.result;
            console.log("Respuestas Api", data);
            console.log("Respuestas traduce", data.translation);

            const jsonSocket = {
                uuid: params.uuid,
                word: palabraActual,
                word_translate: data.translation,
            }

            setPlayers(prevPlayers =>
                prevPlayers.map(player =>
                    player.isActive ? {...player, localPoints: player.localPoints + 1} : player
                )
            );

            setLocalPlayer(prev => ({
                ...prev,
                localPoints: prev.localPoints + 1
            }));


            socket.emit('chatTranslate', (jsonSocket));


        } catch (error) {
            console.error("Error al obtener la traducción:", error);
        }

    };


    return (
        <div className="min-h-screen flex flex-col items-center p-4">


            <div>
                <Clock3 className="w-6 h-6"/>
                <span className="text-2xl font-bold">{timer}s</span>
            </div>

            {/* Turn Messaging */}
            {players.map(player => (
                player.isActive ? (
                    player.user_id === user?.id ? (
                        <div key={player.id} className="text-center mb-4">
                            <span className="text-2xl font-bold text-green-600">¡Es tu turno!</span>
                        </div>
                    ) : (
                        <div key={player.id} className="text-center mb-4">
                            <span className="text-2xl font-bold text-blue-600">Turno de {player.user.name}</span>
                        </div>
                    )
                ) : null
            ))}


            {/* Error Message Section */}
            {errorMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                    bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg
                    animate-bounce">
                    {errorMessage}
                </div>
            )}

            <h1 className="text-4xl text-center font-bold mb-6 text-blue-600">
                Juego de Traducciones
            </h1>

            <div className="w-full max-w-3xl border border-white p-6 rounded-lg shadow-lg">
                {/* Sección de Participantes */}
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blakc-800">Participantes</h2>
                    {players.length > 0 ? (
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {players.map((p: Participant) => (
                                <li
                                    key={p.id}
                                    className="flex items-center bg-blue-800 rounded-lg p-3 shadow-sm">
                                    <img
                                        src={p.user.profile_pic}
                                        alt={p.user.name}
                                        className="w-12 h-12 rounded-full mr-3"
                                    />
                                    <span className="text-lg font-medium">{p.user.username}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay participantes.</p>
                    )}
                </section>

                {/* Sección de Palabra a Resolver */}
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-white-50">Palabra a Resolver</h2>
                    <div className="bg-blue-100 text-blue-800 p-4 text-xl font-semibold text-center rounded-lg shadow">
                        {palabraActual ? palabraActual : "Cargando palabra..."}
                    </div>

                    <h4 className="text-lg font-semibold mt-4">Traducción</h4>
                    <p className="text-lg font-semibold text-center bg-green-100 text-green-800 p-2 rounded-lg shadow">
                        {acertado ? `${palabraActual} = ${wordTranslate}` : "______"}
                    </p>
                </section>

                {/* Sección de Chat */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-white-50">Chat</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            className="flex-1 px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={respuesta}
                            onChange={(e) => setRespuesta(e.target.value)}
                            type="text"
                            placeholder="Escribe la traducción"
                            {...(canWrite ? {autoFocus: true, disabled: false} : {disabled: true})}
                        />
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                            onClick={inputResolve}
                            {...(canWrite ? {autoFocus: true, disabled: false} : {disabled: true})}
                        >
                            Enviar
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );


}

export default TranslationGameComponent;