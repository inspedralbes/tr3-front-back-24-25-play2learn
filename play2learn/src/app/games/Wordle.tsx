// pages/index.js
"use client"

import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { useParams, useRouter } from "next/navigation";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import socket from "@/services/websockets/socket";
import { NavBarContext } from "@/contexts/NavBarContext";
import { auto } from "openai/_shims/registry";
import { LoaderComponent } from '@/components/LoaderComponent';

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
    username?: string;
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
    hasFinished: boolean; // Track if player has finished the current game
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

interface LetraEstado {
    letra: string;
    estado: string;
  }
  

export default function Wordle({ participants, game }: { participants: Participant[]; game: Game }) {

    const [room, setRoom] = useState<Game>()
    const router = useRouter();
    const params = useParams<{ uuid: string }>();
    const { isAuthenticated, token, user } = useContext(AuthenticatorContext);
    const [players, setPlayers] = useState<Player[]>([]);
    const [localPlayer, setLocalPlayer] = useState<Player>({} as Player);
    const [palabra, setPalabra] = useState('');
    const [intentos, setIntentos] = useState<LetraEstado[][]>([]);
    const [intentoActual, setIntentoActual] = useState('');
    const [estadoJuego, setEstadoJuego] = useState('jugando'); // 'jugando', 'ganado', 'perdido', 'timeout'
    const [mensaje, setMensaje] = useState('');
    const MAX_INTENTOS = 6;
    const [maxRound, setMaxRound] = useState(game.n_rounds || 0);
    const [currentRound, setCurrentRound] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const { selectedLanguage } = useContext(NavBarContext);

    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(game.max_time || 15); // Default to 60 seconds if not set
    const [timerActive, setTimerActive] = useState(false);
    const [allPlayersFinished, setAllPlayersFinished] = useState(false);

    // Lista de palabras para el juego
    const palabras = [
        'ACTOR', 'BAILE', 'CARRO', 'DISCO', 'ELITE',
        'FLORA', 'GENTE', 'IGUAL', 'JAQUE', 'LLAVE',
        'MUNDO', 'NUEVO', 'OASIS', 'PAPEL', 'QUESO',
        'RITMO', 'SALTO', 'TIGRE', 'UNION', 'VOLAR'
    ];


    async function translateWords() {
        const targetLanguage = "fr"; // Idioma de destinación (francés)

        // Seleccionar una palabra aleatoria al cargar
        const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
        console.log("PALABRA ORIGINAL: ", palabraAleatoria);

        const jsonData = {
            word: palabraAleatoria,
            source: "es",
            target: selectedLanguage,
        }

        try {
            const response = await apiRequest('/lara/translate', 'POST', jsonData);
            // Convertir a mayúsculas para mantener consistencia con el juego
            const palabraTraducida = response.result.translation.toUpperCase();
            setPalabra(palabraTraducida);
            console.log("PALABRA FINAL ESTABLECIDA: ", palabraTraducida);
            return palabraTraducida; // Return the translated word
        } catch (error) {
            console.error("Error al traducir:", error);
            // Si falla la traducción, usa la palabra original
            setPalabra(palabraAleatoria);
            console.log("USANDO PALABRA ORIGINAL POR ERROR: ", palabraAleatoria);
            return palabraAleatoria; // Return the original word on error
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        // Create an async function inside the effect
        async function initializeGame() {
            await translateWords(); // Wait for translation to complete

            setRoom(game);

            // Initialize players with hasFinished property
            setPlayers(participants.map(participant => ({
                ...participant,
                isActive: false,
                localPoints: 0,
                hasFinished: false
            })));

            // Set local player
            const currentPlayer = participants.find(participant => participant.user.id === user?.id);
            if (currentPlayer) {
                setLocalPlayer({
                    ...currentPlayer,
                    isActive: false,
                    localPoints: 0,
                    hasFinished: false
                } as Player);
            }

            // Start the timer only after word is set
            setTimerActive(true);
        }

        initializeGame();

    }, [isAuthenticated, router]);

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (timerActive && timeRemaining > 0 && estadoJuego === 'jugando' && !gameOver) {
            timer = setTimeout(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timerActive && timeRemaining <= 0 && estadoJuego === 'jugando') {
            // Time's up!
            handleTimeUp();
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timerActive, timeRemaining, estadoJuego, gameOver]);

    // Check if all players have finished
    useEffect(() => {
        if (players.length > 0) {
            const finished = players.every(player => player.hasFinished);
            setAllPlayersFinished(finished);
        }
    }, [players]);

    const handleTimeUp = () => {
        setEstadoJuego('timeout');
        setTimerActive(false);
        setMensaje(`¡Tiempo agotado! La palabra era: ${palabra}`);

        // Subtract 5 points from local player
        setLocalPlayer(prev => ({
            ...prev,
            localPoints: Math.max(0, prev.localPoints - 5), // Prevent negative points
            hasFinished: true
        }));

        // Update player in players list
        setPlayers(prev =>
            prev.map(player =>
                player.id === localPlayer.id
                    ? {
                        ...player,
                        localPoints: Math.max(0, player.localPoints - 5),
                        hasFinished: true
                    }
                    : player
            )
        );

        // Advance to next round after a delay
        setTimeout(() => {
            siguienteRonda();
        }, 2000);
    };

    const manejarTecla = (tecla: any) => {
        if (estadoJuego !== 'jugando' || gameOver || !timerActive || timeRemaining <= 0) return;

        if (tecla === 'ENTER') {
            verificarIntento();
        } else if (tecla === 'BORRAR') {
            setIntentoActual(prev => prev.slice(0, -1));
        } else if (/^[A-Z]$/.test(tecla) && intentoActual.length < palabra.length) {
            // Ahora acepta hasta la longitud de la palabra actual
            setIntentoActual(prev => prev + tecla);
        }
    };
    // Replace your verificarIntento function with this updated version
    const verificarIntento = () => {
        // Verificar que el intento tenga la misma longitud que la palabra
        if (intentoActual.length !== palabra.length) {
            setMensaje(`La palabra debe tener ${palabra.length} letras`);
            return;
        }

        // Para la comprobación de si la palabra existe en la lista,
        // probablemente necesites actualizar tu lista de palabras o
        // eliminar esta validación si usas traducciones

        // Comentada temporalmente porque las traducciones no estarán en la lista
        // if (!palabras.includes(intentoActual)) {
        //     setMensaje('La palabra no está en la lista');
        //     return;
        // }

        const nuevoIntento = [];
        const palabraArray = palabra.split('');

        // Verificar letras correctas en posición correcta
        for (let i = 0; i < palabra.length; i++) {
            if (intentoActual[i] === palabraArray[i]) {
                nuevoIntento.push({ letra: intentoActual[i], estado: 'correcto' });
            } else if (palabraArray.includes(intentoActual[i])) {
                nuevoIntento.push({ letra: intentoActual[i], estado: 'presente' });
            } else {
                nuevoIntento.push({ letra: intentoActual[i], estado: 'ausente' });
            }
        }

        const nuevosIntentos = [...intentos, nuevoIntento];
        setIntentos(nuevosIntentos);
        setIntentoActual('');
        setMensaje('');

        // Verificar si el jugador ganó
        if (intentoActual === palabra) {
            setEstadoJuego('ganado');
            setTimerActive(false);
            setMensaje('¡Felicidades, has ganado!');

            // Update local player as finished with points
            setLocalPlayer(prev => ({
                ...prev,
                localPoints: prev.localPoints + 10,
                hasFinished: true
            }));

            // Update player in players list
            setPlayers(prev =>
                prev.map(player =>
                    player.id === localPlayer.id
                        ? { ...player, localPoints: player.localPoints + 10, hasFinished: true }
                        : player
                )
            );

            // Avanzar a la siguiente ronda
            setTimeout(() => {
                siguienteRonda();
            }, 2000);

        } else if (nuevosIntentos.length >= MAX_INTENTOS) {
            // Verificar si el jugador perdió
            setEstadoJuego('perdido');
            setTimerActive(false);
            setMensaje(`¡Perdiste! La palabra era: ${palabra}`);

            // Mark player as finished
            setLocalPlayer(prev => ({
                ...prev,
                hasFinished: true
            }));

            // Update player status in list
            setPlayers(prev =>
                prev.map(player =>
                    player.id === localPlayer.id
                        ? { ...player, hasFinished: true }
                        : player
                )
            );

            // Avanzar a la siguiente ronda
            setTimeout(() => {
                siguienteRonda();
            }, 2000);
        }
    };

    // Función para avanzar a la siguiente ronda
    const siguienteRonda = () => {
        const nuevaRonda = currentRound + 1;
        setCurrentRound(nuevaRonda);

        if (nuevaRonda >= maxRound) {
            // Fin del juego
            setGameOver(true);
            setMensaje('¡Juego terminado! Has completado todas las rondas.');

            // Add the API request to store stats when game is over
            apiRequest("/game/store/stats", "POST", { players: players })
                .then((response) => {
                    console.log(response);
                    console.log("EMIT DE SHOWLEADER");

                    // Luego envía solo los datos necesarios a través de socket.io
                    socket.emit("showLeader", { token: token, roomUUID: game.uuid });

                    console.log("todos terminaron");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // Iniciar siguiente ronda
            reiniciarJuego();
        }
    };

    const reiniciarJuego = async () => {
        // Wait for translation before proceeding
        await translateWords();

        setIntentos([]);
        setIntentoActual('');
        setEstadoJuego('jugando');
        setMensaje('');

        // Reset timer
        setTimeRemaining(game.max_time || 60);
        setTimerActive(true);

        // Reset player finished status
        setLocalPlayer(prev => ({ ...prev, hasFinished: false }));
        setPlayers(prev =>
            prev.map(player =>
                player.id === localPlayer.id
                    ? { ...player, hasFinished: false }
                    : player
            )
        );
    };

    const reiniciarTodoElJuego = () => {
        // Only allow if all players have finished or it's a single player game
        if (!allPlayersFinished && players.length > 1) {
            setMensaje('Esperando a que todos los jugadores terminen...');
            return;
        }

        setCurrentRound(0);
        setGameOver(false);
        setPlayers(prev =>
            prev.map(player => ({ ...player, localPoints: 0, hasFinished: false }))
        );
        setLocalPlayer(prev => ({ ...prev, localPoints: 0, hasFinished: false }));
        reiniciarJuego();
    };

    // Teclado virtual
    const teclado = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BORRAR']
    ];

    // Determinar el estado de cada tecla
    const obtenerEstadoTecla = (tecla:any) => {
        let estado = '';

        for (let i = 0; i < intentos.length; i++) {
            for (let j = 0; j < intentos[i].length; j++) {
                if (intentos[i][j].letra === tecla) {
                    const nuevoEstado = intentos[i][j].estado;

                    if (nuevoEstado === 'correcto') {
                        return 'correcto';
                    } else if (nuevoEstado === 'presente' && estado !== 'correcto') {
                        estado = 'presente';
                    } else if (nuevoEstado === 'ausente' && estado === '') {
                        estado = 'ausente';
                    }
                }
            }
        }

        return estado;
    };

    // Format time as mm:ss
    const formatTime = (seconds: any) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Efecto para escuchar eventos de teclado
    useEffect(() => {
        const manejarTecladoFisico = (event: KeyboardEvent) => {
            const tecla = event.key.toUpperCase();

            if (tecla === 'ENTER') {
                manejarTecla('ENTER');
            } else if (tecla === 'BACKSPACE') {
                manejarTecla('BORRAR');
            } else if (/^[A-ZÑ]$/.test(tecla)) {
                manejarTecla(tecla);
            }
        };

        window.addEventListener('keydown', manejarTecladoFisico);

        return () => {
            window.removeEventListener('keydown', manejarTecladoFisico);
        };
    }, [intentoActual, estadoJuego, gameOver, timerActive, timeRemaining]);

    if (!players || players.length === 0) {
        return <LoaderComponent />;
    } else {
        return (
            <div className="min-h-screen flex flex-col items-center py-8">
                <Head>
                    <title>Wordle - Juego de palabras</title>
                    <meta name="description" content="Una versión de Wordle en Next.js" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <h1 className="text-4xl font-bold mb-4">Wordle</h1>

                <div
                    className="absolute flex content-center items-center gap-20 top-0 px-4 py-2 bg-opacity-25 rounded-full bg-black text-white">
                    {intentos.length} / {MAX_INTENTOS}
                </div>

                <div
                    className="absolute top-1 rounded-full left-0 gap-2 flex items-center content-center text-black bg-white px-4 py-2 bg-opacity-25">
                    <span className="text-2xl font-bold">{currentRound}/{maxRound}</span>
                </div>

                {/* Timer display */}
                <div
                    className={`absolute top-1 right-0 px-4 py-2 rounded-full ${timeRemaining <= 10 ? 'bg-red-500' : 'bg-blue-500'} text-white`}>
                    <span className="text-2xl font-bold">{formatTime(timeRemaining)}</span>
                </div>

                {/* Sección de Participantes */}
                <section className="mb-6">
                    {players.length > 0 ? (
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {players.map((p: Player) => (
                                <li
                                    key={p.id}
                                    className={`flex flex-col items-center ${p.hasFinished ? 'bg-green-700' : 'bg-blue-800'} rounded-lg p-3 shadow-sm text-white`}>
                                    <img
                                        src={p.user.profile_pic}
                                        alt={p.user.name}
                                        className="w-12 h-12 rounded-full mb-2"
                                    />
                                    <span className="text-lg font-medium">{p.user.username || p.user.name}</span>
                                    <span className="text-lg">Puntos: {p.localPoints}</span>
                                    {p.hasFinished && <span
                                        className="text-xs mt-1 bg-white text-green-700 px-2 py-1 rounded-full">Completado</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No hay participantes.</p>
                    )}
                </section>

                {mensaje && (
                    <div
                        className={`mb-4 p-2 ${estadoJuego === 'timeout' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} rounded`}>
                        {mensaje}
                    </div>
                )}

                {gameOver ? (
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold mb-4">¡Juego Terminado!</h2>
                        <p className="text-xl mb-4">Has completado todas las rondas.</p>

                        <div className="mb-6">
                            <h3 className="text-2xl font-semibold mb-2">Puntuaciones finales:</h3>
                            <ul className="space-y-2">
                                {players
                                    .sort((a, b) => b.localPoints - a.localPoints)
                                    .map((player) => (
                                        <li key={player.id} className="text-lg">
                                            {player.user.username || player.user.name}: {player.localPoints} puntos
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <button
                            onClick={reiniciarTodoElJuego}
                            className={`mt-4 py-2 px-6 ${!allPlayersFinished && players.length > 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg text-lg`}
                            disabled={!allPlayersFinished && players.length > 1}
                        >
                            {!allPlayersFinished && players.length > 1 ? 'Esperando a otros jugadores...' : 'Jugar de nuevo'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            {/* Tablero de juego - ahora dinámico basado en la longitud de la palabra */}
                            <div className="grid grid-rows-6 gap-2">
                                {/* Renderizar intentos realizados */}
                                {Array.from({ length: MAX_INTENTOS }).map((_, rowIndex) => (
                                    <div key={rowIndex} className="flex gap-2 justify-center">
                                        {rowIndex < intentos.length
                                            ? intentos[rowIndex].map((item, colIndex) => (
                                                <div
                                                    key={colIndex}
                                                    className={`
                                w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 
                                ${item.estado === 'correcto'
                                                            ? 'bg-green-500 text-white border-green-600'
                                                            : item.estado === 'presente'
                                                                ? 'bg-yellow-500 text-white border-yellow-600'
                                                                : 'bg-gray-500 text-white border-gray-600'
                                                        }
                            `}
                                                >
                                                    {item.letra}
                                                </div>
                                            ))
                                            : rowIndex === intentos.length
                                                ? // Intento actual - ahora dinámico según la longitud de la palabra
                                                Array.from({ length: palabra.length }).map((_, colIndex) => (
                                                    <div
                                                        key={colIndex}
                                                        className={`
                                    w-14 h-14 flex items-center justify-center text-2xl font-bold 
                                    border-2 border-gray-300
                                    ${colIndex < intentoActual.length ? 'border-gray-500' : ''}
                                `}
                                                    >
                                                        {colIndex < intentoActual.length ? intentoActual[colIndex] : ''}
                                                    </div>
                                                ))
                                                : // Filas vacías - ahora dinámico según la longitud de la palabra
                                                Array.from({ length: palabra.length }).map((_, colIndex) => (
                                                    <div
                                                        key={colIndex}
                                                        className="w-14 h-14 flex items-center justify-center text-2xl font-bold border-2 border-gray-200"
                                                    ></div>
                                                ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Teclado virtual */}
                        <div className="w-full max-w-xl">
                            {teclado.map((fila, rowIndex) => (
                                <div key={rowIndex} className="flex justify-center mb-2">
                                    {fila.map((tecla) => {
                                        const estadoTecla = obtenerEstadoTecla(tecla);
                                        let clases = 'mx-1 py-3 rounded font-bold';

                                        if (tecla === 'ENTER' || tecla === 'BORRAR') {
                                            clases += ' px-2 text-xs';
                                        } else {
                                            clases += ' w-10';
                                        }

                                        if (estadoTecla === 'correcto') {
                                            clases += ' bg-green-500 text-white';
                                        } else if (estadoTecla === 'presente') {
                                            clases += ' bg-yellow-500 text-white';
                                        } else if (estadoTecla === 'ausente') {
                                            clases += ' bg-gray-500 text-white';
                                        } else {
                                            clases += ' bg-gray-300';
                                        }

                                        // Disable keyboard when time is up or game is not in 'jugando' state
                                        if (estadoJuego !== 'jugando' || gameOver || !timerActive || timeRemaining <= 0) {
                                            clases += ' opacity-50 cursor-not-allowed';
                                        }

                                        return (
                                            <button
                                                key={tecla}
                                                className={clases}
                                                onClick={() => manejarTecla(tecla)}
                                                disabled={estadoJuego !== 'jugando' || gameOver || !timerActive || timeRemaining <= 0}
                                            >
                                                {tecla}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {(estadoJuego !== 'jugando' || timeRemaining <= 0) && !gameOver && (
                            <div className="mt-6 text-center">
                                <p className="mb-2">
                                    {estadoJuego === 'ganado'
                                        ? '¡Has acertado! +10 puntos.'
                                        : estadoJuego === 'timeout'
                                            ? `¡Tiempo agotado! -5 puntos. La palabra era: ${palabra}`
                                            : `Se acabaron los intentos. La palabra era: ${palabra}`}
                                </p>
                                <p className="text-lg font-semibold mb-2">
                                    {currentRound < maxRound - 1
                                        ? `Pasando a la ronda ${currentRound + 2}...`
                                        : "¡Última ronda completada!"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }
}