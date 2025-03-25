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

            } catch (error) {
                console.log("Error ", error)
            }
        }

        fetchRoom();

        socket.on('wordRoom', (data) => {
            console.log("SOCKET: ", data);
            setPalabraActual(data.word);
        });

        socket.on('translateClient', (data) => {
            console.log("Chat", data);
            if (data.word_translate && data.word_translate.toLowerCase() === data.word) {
                setAcertado(true);
                setWordTranslate(data.word_translate);
                console.log("¡Acertado!");
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
        if (host) {
            // Llamar a la función que debe ejecutar el host
            getRandomWord();
            setWordGenerated(true)
        }
    }, [participant]);

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

        socket.emit('randomWord', jsonData);
    }

    return (
        <div>
            <h1 className="text-4xl text-center font-bold mb-5">Juego de traducciones</h1>

            <div>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Participantes</h2>
                    {participant && participant.length > 0 ? (
                        <ul className="space-y-2">
                            {participant.map((participant: Participant) => (
                                <li
                                    key={participant.id}
                                    className="flex items-center rounded-lg p-2 shadow-md"
                                >
                                    <img
                                        src={participant.user.profile_pic}
                                        alt={participant.user.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <span className="text-lg font-semibold">{participant.user.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay participantes.</p>
                    )}
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Palabra a resolver</h2>
                    {palabraActual ? (
                        <p>{palabraActual}</p>
                    ) : (
                        <p>Cargando palabra...</p>
                    )}

                    <h4>Traduccion</h4>
                    <p>{acertado ? palabraActual + ' = ' + wordTranslate : "______"}</p>


                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Chat</h2>
                    <input className="rounded" value={respuesta}
                           onChange={(e) => setRespuesta(e.target.value)} type="text"
                           placeholder="Escribe la traducción"/>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={inputResolve}>Enviar</button>
                </section>

            </div>
        </div>
    )

}

export default TranslationGameComponent;