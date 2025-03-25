"use client"

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import AvatarUserProfile from "@/components/ui/AvatarUserProfile";


export default function LobbyGameClient() {
    const params = useParams<{ uuid: string }>();
    const { isAuthenticated } = useContext(AuthenticatorContext);
    const router = useRouter();
    const { token } = useContext(AuthenticatorContext);


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

    const [participants, setParticipants] = useState<Participant[]>([]);

    const handleLeaveGame = () => {
        socket.emit('leaveGame', { token: token || "", roomUUID: params.uuid });
        router.push("/");
    };


    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/authenticate/login");
            return;
        }

        socket.emit('getGame', { token: token || "", roomUUID: params.uuid });

        socket.on('playerJoined', (data) => {
            console.log(data);
            setParticipants(data.game.participants || []);
        });

        socket.on('gameDeleted', (data) => {
            setParticipants([]);
            router.push("/");
        });

        // Limpiar event listeners
        socket.on('gameStarted', (data) => {
            console.log("Socket", data);
            console.log("Socket uuid", data.game.uuid)
            router.push(`/games/translation/${data.game.uuid}`);
        });

        return () => {
            socket.off('playerJoined');
            socket.off('gameDeleted');
            socket.off('gameStarted');
        };
    }, [isAuthenticated, router]);



    function goToTranslate() {
        socket.emit('startGame', {token: token || "", roomUUID: params.uuid});
    }

    return (
        <div>
            <h1>Lobby Game Client {params.uuid}</h1>
            <div className="flex gap-4">
                {participants.map((participant) => (
                    <AvatarUserProfile
                        key={participant.id}
                        name={participant.user.name}
                        profile_pic={participant.user.profile_pic}
                    />
                ))}
            </div>
            <button onClick={handleLeaveGame} className="bg-red-500 text-white px-4 py-2 rounded">Leave Game</button>
            <button className="mt-5" onClick={goToTranslate}>Start Game</button>
        </div>
    );
}