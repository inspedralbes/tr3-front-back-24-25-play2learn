"use client";

import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";
import Link from "next/link"
import {useContext, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslation} from "@/hooks/useTranslation";
import socket from "@/services/websockets/socket";
import {apiRequest} from "@/services/communicationManager/apiRequest";
import {auto} from "openai/_shims/registry";

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

interface Room {
    id: number,
    id_level_language: number,
    participants: Participant
    max_clues: number,
    max_players: number,
    max_time: 10,
    n_rounds: number,
    language_level: LanguageLevel
    name: string,
    password: number,
    status: string,
    uudi: number,
    updated_at: string,
    created_at: string
}

function TranslationGameComponent() {

    const {authUser} = useContext(AuthenticatorContext);
    const router = useRouter();
    const {t} = useTranslation();
    const params = useParams<{ uuid: string }>();
    const {isAuthenticated, token} = useContext(AuthenticatorContext);
    const [participant, setParticipant] = useState<Participant[]>([]);
    const [language, setLanguage] = useState<LanguageLevel[]>([])
    const [room, setRoom] = useState<Room[]>([])
    const [acertado, setAcertado] = useState(false);
    const [respuesta, setRespuesta] = useState("");
    const [palabraActual, setPalabraActual] = useState('');
    const [wordTranslate, setWordTranslate] = useState('');
    const [wordGenerated, setWordGenerated] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        async function fetchRoom() {
            try {

                const response = await apiRequest(`/games/${params.uuid}`, "GET");
                console.log("JUEGO", response);
                setParticipant(response.game.participants);
                setLanguage(response.game.language_level);
                setRoom(response.game);

                console.log("Solicitando palabra actual...");
                socket.emit("getCurrentWord", {uuid: params.uuid});

            } catch (error) {
                console.log("Error ", error)
            }
        }

        fetchRoom();

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
                socket.emit('randomWord', {uuid: params.uuid})
                setAcertado(false)
            } else {
                console.log("Respuesta incorrecta o palabra no encontrada");
            }
        });


        return () => {
            socket.off('wordRoom');
            socket.off('translateClient');
        };

    }, [isAuthenticated, router]);


    useEffect(() => {
        const host = participant.find(p => p.rol === 'host');
        if (host && !palabraActual) {
            // Llamar a la función que debe ejecutar el host

            console.log("No hay palabra actual, generando una nueva...");
            console.log("Emitiendo evento randomWord al servidor...");
            console.log("Host detectado, generando nueva palabra...");

            socket.emit('randomWord', {uuid: params.uuid});
            //getRandomWord();
            setWordGenerated(true)
        }
    }, [participant, palabraActual]);

    const inputResolve = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("Hola");
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

            socket.emit('chatTranslate', (jsonSocket));

        } catch (error) {
            console.error("Error al obtener la traducción:", error);
        }

    };

    function getRandomWord() {
        const jsonDE = {
            "palabras": [
                "hallo",
                "bitte",
                "danke",
                "entschuldigung",
                "ja",
                "nein",
                "freund",
                "liebe",
                "essen",
                "trinken"
            ]
        };
        const randomIndex = Math.floor(Math.random() * jsonDE.palabras.length);
        const jsonData = {
            uuid: params.uuid,
            word: jsonDE.palabras[randomIndex],
        }

        console.log("json enviar", jsonData);

    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4">
            <h1 className="text-4xl text-center font-bold mb-6 text-blue-600">
                Juego de Traducciones
            </h1>

            <div className="w-full max-w-3xl border border-white p-6 rounded-lg shadow-lg">
                {/* Sección de Participantes */}
                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-blakc-800">Participantes</h2>
                    {participant.length > 0 ? (
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {participant.map((p: Participant) => (
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
                        />
                        <button
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                            onClick={inputResolve}
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