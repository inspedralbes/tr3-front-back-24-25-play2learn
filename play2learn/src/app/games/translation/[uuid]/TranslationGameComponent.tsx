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
    const params = useParams<{ uuid: string }>();
    const {isAuthenticated, token, user} = useContext(AuthenticatorContext);
    const [players, setPlayers] = useState<Player[]>([]);
    const [room, setRoom] = useState<Game>()
    const [acertado, setAcertado] = useState(false);
    const [respuesta, setRespuesta] = useState("");
    const [palabraActual, setPalabraActual] = useState('');
    const [oldWord, setOldWord] = useState<string | null>(null);
    const [worldClient, setWordClient] = useState<string | null>(null);
    const [wordTranslate, setWordTranslate] = useState('');
    const [canWrite, setCanWrite] = useState(false); // Si el usuario puede escribir
    const [localPlayer, setLocalPlayer] = useState<Player>({} as Player);
    const [timer, setTimer] = useState(15);
    const [gameStarted, setGameStarted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [correctMessage, setCorrectMessage] = useState<string | null>(null);
    const [myTurn, setMyTurn] = useState(false);
    const [roundCount, setRoundCount] = useState(0);
    const [maxRound, setMaxRound] = useState(0);

    const endGame = () => {

        console.log("-----------------------------FIN-----------------------------")
        console.log("-------------------------------PARTICIPANTES-------------------------------");
        console.table(players);

        if (myTurn) {
            apiRequest("/game/store/stats", "POST", {players: players})
                .then((response) => {
                    console.log(response)
                    socket.emit("showLeader", {token: token, roomUUID: game.uuid});
                    console.log("todos terminaron")
                })
                .catch((error) => {
                    console.log(error)
                })
        }

        //alert("¡El juego ha terminado! Gracias por jugar.");

        //router.push("/"); // Puedes redirigir a otra página o mostrar un modal
    };

    function nextPlayer() {
        const currentIndex = players.find(p => p.isActive);

        console.log("Jugador activo antes de cambiar turno:", currentIndex);

        if (!currentIndex) {
            console.error("No se encontró ningún jugador activo.");
            return;
        }

        setMyTurn(currentIndex.user_id == user?.id);


        socket.emit('nextTurnGeneral', {
            roomUUID: game.uuid,
            user_id: currentIndex?.user_id,
            points: currentIndex?.localPoints
        });


        setTimer(timer);
    };

    function sumRound() {
        if (roundCount >= maxRound) {
            setGameStarted(false);
            console.log("adios")
            endGame();
        } else {

            if (myTurn) {
                let jsonData = {
                    uuid: params.uuid,
                    round: roundCount + 1
                }
                socket.emit('roundRoom', jsonData);

            }
        }

    }

    const startGame = () => {

        socket.emit('getTurn', ({roomUUID: params.uuid}));
        setGameStarted(true);
        randomWord();
    };

    function sumaPointPlayer() {
        console.log("Sumant punt al jugador actiu");
        // Actualización de puntos y siguiente turno
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.isActive ? {...player, localPoints: player.localPoints + 10} : player
            )
        );

        setLocalPlayer(prev => ({
            ...prev,
            localPoints: prev.localPoints + 1
        }));

        sumRound();

        setOldWord(null);

        if (myTurn) {
            nextPlayer();
        }
    }

    function randomWord() {
        setWordTranslate("");
        socket.emit('randomWord', {uuid: params.uuid});
    }

    function restaPointsPlayer() {
        console.log("Resta punt al jugador actiu");
        console.log("Rondas aqui", roundCount)
        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                ({...player})
            )
        );

        setPlayers(prevPlayers =>
            prevPlayers.map(player =>
                player.isActive ? {...player, localPoints: player.localPoints - 5} : player
            )
        );

        sumRound();

        if (myTurn) {
            nextPlayer();
        }

    }


    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        setRoom(game);


        if (!gameStarted) {
            console.log("EMPEZO")
            startGame();

            setPlayers(participants.map(participant => ({
                ...participant,
                isActive: false,
                localPoints: 0
            })));

            setLocalPlayer(participants.find(participant => participant.user.id === user?.id) as Player);
        }


        socket.on('turn', (data) => {
            console.log("--------------------TURNO DE--------------------")
            console.table(data.turn.user); // Muestra los datos en formato de tabla
            const {turn, errors} = data;

            setPlayers(prevPlayers =>
                prevPlayers.map((player) => ({
                    ...player,
                    isActive: player.user_id === turn.user_id
                }))
            );

            setTimeout(() => {
                setMyTurn(turn.user_id === user?.id)
            }, 1000); // 3 segundos antes de cambiar de palabra


            setCanWrite(false);
            if (turn.user_id === user?.id) {
                setCanWrite(true);
            }
            setTimer(data.game.max_time)
            setMaxRound(data.game.n_rounds);

        });

        socket.on('wordRoom', (data) => {

            if (data && data.word) {
                setPalabraActual(prev => {
                    return data.word;
                });
                setOldWord(data.word);
                //setPalabraActual(data.word);
            } else {
                console.warn("No se recibió una palabra válida.");
            }
        });

        socket.on('translateClient', (data) => {
            if (data.word_translate && data.word_translate.toLowerCase() === data.word) {
                setWordClient(data.word_input);
                setAcertado(true);
                setWordTranslate(data.word_translate);
                setRespuesta('')
                setCorrectMessage('¡Correcto sigue asi!')
                // Clear error message after 3 seconds
                setTimeout(() => {
                    setCorrectMessage(null);
                }, 1000);

                // Mostrar la palabra con la traducción durante 3 segundos antes de cambiar
                setTimeout(() => {
                    setCorrectMessage(null);
                    setAcertado(false);
                    setCanWrite(true); // Habilitar nuevamente la entrada
                    randomWord();
                }, 1000); // 3 segundos antes de cambiar de palabra

                //setAcertado(false);
            } else {
                // Add error message when translation is incorrect
                setErrorMessage("¡Te has equivocado! Intenta de nuevo.");
                // Clear error message after 3 seconds
                setTimeout(() => {
                    setErrorMessage(null);
                }, 1000);

                setAcertado(false);
                console.log("Respuesta incorrecta o palabra no encontrada");
            }
        });

        socket.on('leader', (data) => {
            console.log("SOCKET FIN")
            console.table(data);
            //router.push('/');
        });

        socket.on('countRound', (data) => {
            console.log("RONDAS", data);
            setRoundCount(data.round);
        });


        return () => {
            socket.off('wordRoom');
            socket.off('translateClient');
            socket.off('turn');
            socket.off('leader');
            socket.off('countRound');
        };

    }, [isAuthenticated, router]);


    useEffect(() => {

        let interval: NodeJS.Timeout;

        if (gameStarted && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            console.log("SE ACABO CRACK");

            // Si no, seguir con el contador normal
            restaPointsPlayer();
        }

        return () => clearInterval(interval);

    }, [gameStarted, timer])

    const inputResolve = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const language = "de"
        try {
            if (respuesta.trim() == '') {
                setErrorMessage("No puedes enviar vacio")
                setTimeout(() => {
                    setErrorMessage(null)
                }, 1000)
            } else {
                //const responseApi = await fetch(`/api/openai-translate?word=${respuesta.toLowerCase()}&language=${language}`);
                const jsonData = {
                    word: respuesta.toLowerCase(),
                    source: auto,
                    target: language,
                }

                const response = await apiRequest('/lara/translate', "POST", jsonData);

                const data = await response.result;

                const jsonSocket = {
                    uuid: params.uuid,
                    word: palabraActual,
                    word_translate: data.translation,
                    word_input: respuesta.toLowerCase(),
                }

                console.log("API")
                console.table(data);

                console.log("oldWORD", oldWord);
                console.log("Actual", palabraActual);

                if (data.translation.toLowerCase() === palabraActual) {
                    console.log("ACERTADO DESDE EL FETCH")

                    if (myTurn) {
                        sumaPointPlayer();
                    }

                } else {
                    if (myTurn) {
                        restaPointsPlayer();
                    }
                }

                socket.emit('chatTranslate', (jsonSocket));

            }
        } catch (error) {
            console.error("Error al obtener la traducción:", error);
        }

    };


    return (
        <div className="min-h-screen flex flex-col items-center p-4">

            <div
                className="absolute top-1 right-5 rounded-full gap-2 flex items-center text-black bg-white px-4 py-2 bg-opacity-25">
                <Clock3 className="w-6 h-6"/>
                <span className="text-2xl font-bold">{timer}s</span>
            </div>

            <div
                className="absolute top-1 right-120 rounded-full gap-2 flex items-center content-center text-black bg-white px-4 py-2 bg-opacity-25">
                <span className="text-2xl font-bold">{roundCount}/{maxRound}</span>
            </div>

            {/* Turn Messaging */}
            {players.map(player => (
                player.isActive ? (
                    player.user_id === user?.id ? (
                        <div key={player.id}
                             className="text-center mb-4 absolute top-2 left-3 bg-white rounded-full px-4 py-2">
                            <span className="text-1xl font-bold text-green-600">¡Es tu turno!</span>
                        </div>
                    ) : (
                        <div key={player.id}
                             className="text-center mb-4 absolute top-2 left-3 bg-white rounded-full px-4 py-2">
                            <span className="text-1xl font-bold text-blue-600">Turno de {player.user.username}</span>
                        </div>
                    )
                ) : null
            ))}


            {/* Error Message Section */}
            {myTurn && errorMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg
                animate-bounce">
                    {errorMessage}
                </div>
            )}

            {myTurn && correctMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50
                    bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg
                    animate-bounce">
                    {correctMessage}
                </div>
            )}

            <h1 className="text-4xl text-center font-bold mb-6 mt-9 text-white-600">
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
                        {acertado ? `${palabraActual} = ${worldClient}` : "______"}
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
                            {...(myTurn ? {autoFocus: true, disabled: false} : {disabled: true})}
                        />
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                            onClick={inputResolve}
                            {...(myTurn ? {autoFocus: true, disabled: false} : {disabled: true})}
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