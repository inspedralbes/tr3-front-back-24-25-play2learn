"use client";

import {AuthenticatorContext} from "@/contexts/AuthenticatorContext";
import Link from "next/link"
import {useContext, useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslation} from "@/hooks/useTranslation";
import socket from "@/services/websockets/socket";
import {apiRequest} from "@/services/communicationManager/apiRequest";

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

        return () => {

        };
    }, [isAuthenticated, router]);

    useEffect(() => {
        console.log("Room actualizado:", room);
    }, [room]);

    const inputResolve = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("Hola")
        if (e.key === "Enter") {
            if (respuesta.toLowerCase() === "aleatorio")
                setAcertado(true);
        }
    };


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
                    <p>Aleatorio</p>

                    <p>{acertado ? "Aleatorio" : "______"}</p>

                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Chat</h2>
                    <input className="rounded" value={respuesta}
                           onChange={(e) => setRespuesta(e.target.value)} type="text"
                           placeholder="Escribe la traducción" onKeyDown={inputResolve}/>
                </section>

            </div>
        </div>
    )

}

export default TranslationGameComponent;