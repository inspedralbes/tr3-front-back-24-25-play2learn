"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import { apiRequest } from "@/services/communicationManager/apiRequest";


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

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        apiRequest("/games/" + game.uuid, "GET")
        .then((response)=>{
            setParticipantsOrderedByPoints(response.game.participants.sort((a, b) => b.points - a.points));
        })

    }, [isAuthenticated, router]);

    const handleNextGame = () => {
        socket.emit('nextGame', {roomUUID: game.uuid})
    };

    if (!game.id || participantsOrderedByPoints.length === 0) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>LeaderGame</h1>
                <p>{game.name}</p>

                {participantsOrderedByPoints.map((participant) => (
                    <div key={participant.id}>
                        <p>{participant.user.name}</p>
                        <p>{participant.rol}</p>
                        <p>{participant.points}</p>
                    </div>
                ))}

                <button onClick={handleNextGame}>Next Game</button>
            </div>
        );
    }
}

export default LeaderGame;