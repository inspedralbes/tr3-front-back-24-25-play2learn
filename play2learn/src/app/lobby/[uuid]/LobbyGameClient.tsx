
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

        return () => {
            socket.off('playerJoined');
        };
    }, [isAuthenticated, router]);

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
        </div>
    );
}