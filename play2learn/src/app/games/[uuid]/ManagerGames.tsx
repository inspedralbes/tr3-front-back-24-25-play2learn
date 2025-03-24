"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import { useState } from "react";
import WordChain from "../WordChain";

export default function ManagerGames() {
  const params = useParams<{ uuid: string }>();
  const { isAuthenticated, token } = useContext(AuthenticatorContext);
  const router = useRouter();

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

  const [game, setGame] = useState<Game>({} as Game);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [randomGame, setRandomGame] = useState<number | null>(null);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    socket.emit("getGame", { token: token || "", roomUUID: params.uuid });

    socket.on("inGame", (data) => {
      setGame(data.game || {} as Game);
      setParticipants(data.game.participants || []);
      setRandomGame(data.game_num_random);
    });

    // Limpiar event listeners
    return () => {
      socket.off("inGame");
    };
  }, [isAuthenticated, router]);

  useEffect(()=>{
    console.log(participants)
  },[participants])


  if (!game.id || participants.length === 0) {
    return <div>Loading...</div>;
  } else {
    return <WordChain participants={participants} game={game} />;
  }
  
}
