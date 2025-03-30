"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import { useState } from "react";
import Hangman from "../Hangman";
import WordChain from "../WordChain";
import LeaderGame from "../LeaderGame";
import TranslationGameComponent from "../TranslationGameComponent";
import { LoaderComponent } from "@/components/LoaderComponent";

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
  const [leaderView, setLeaderView] = useState<boolean>(false);

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

      setLeaderView(data.showLeader);
      console.log(data.game_num_random)
    });

    socket.on('chargeGame', (data) => {
      console.log(data.game_num_rounds)
      if (data.game_num_rounds !== null) {
        setGame(data.game || {} as Game);
        setParticipants(data.game.participants || []);
        setRandomGame(data.game_num_random);
        setLeaderView(data.showLeader);

      } else {
        router.push(`/games/${params.uuid}/finished`)
      }
    });

    socket.on('participantsLoaders', (data) => {
      console.log("HOLAAAAAAAAA")
      setParticipants(data.game.participants || []);
    });

    socket.on('leader', (data) => {
      console.log("HOLAAAAAAAAA X 222222222")
      setLeaderView(data.showLeader);

    })

    // Limpiar event listeners
    return () => {
      socket.off("inGame");
      socket.off("chargeGame");
      socket.off("leader");
      socket.off("participantsLoaders")
    };
  }, [isAuthenticated, router]);


  if (!game.id || participants.length === 0) {
    return <LoaderComponent />;
  } else if (leaderView) {
    return <LeaderGame game={game} participants={participants} />;
  } else {
    switch(randomGame)
    {
      case 1:
        return <WordChain participants={participants} game={game} />;
      case 2:
        return <Hangman participants={participants} game={game} />;
      // case 3:
      //   return <Hangman participants={participants} game={game} />;
      default:
        return <WordChain participants={participants} game={game} />
    }
  }
  
}
