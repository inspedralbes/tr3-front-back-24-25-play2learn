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
import Wordle from "@/app/games/Wordle/[uuid]/Wordle";
import WordleComponent from "@/app/games/Wordle/[uuid]/page";

export default function ManagerGames() {
  const params = useParams<{ uuid: string }>();
  const { isAuthenticated, token } = useContext(AuthenticatorContext);
  const router = useRouter();

  //Creació dels diferents Interface per poder utilitzar-los
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
    username: string;
    profile_pic: string;
  }

  interface Participant {
    id: number;
    user: User;
    user_id: number;
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

  /**
   * Aqui fem un useEffect per a obtenir el joc i els seus participants com també per verificar que esta logejat 
   * i el token es valid, en cas contrari es fara un redireccionament al login.
   * 
   * També s'escullen els events per a gestionar la llista de participants i el joc.
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }
    
    /**
     * Aquest primer emit que es fan al iniciar, es per a obtenir el joc i els seus participants.
     */
    socket.emit("getGame", { token: token || "", roomUUID: params.uuid });

    /**
     * S'escullen els events per a gestionar la llista de participants i el joc.
     * Aqui es seteen el joc; configuració del joc, estat etc i també la llista de participants.
     * I el leader view que es una variable booleana que indica si es mostra el leader o no.
     */
    socket.on("inGame", (data) => {
      setGame(data.game || ({} as Game));
      setParticipants(data.game.participants || []);
      setRandomGame(data.game_num_random);

      setLeaderView(data.showLeader);
      console.log(data.game_num_random);
    });

    /**
     * Aquest socket es per carrega el seguent joc. 
     * Si el joc no existeix, es redirecciona al usuari al finalitzat que es quan ja s'ha acabat les rondes.
     * Si el joc continua, es a dir, si el game_num_rounds no es null es mostrara el leaderView que esta gestionat en el back del websockets.
     */
    socket.on("chargeGame", (data) => {
      console.log(data.game_num_rounds);
      if (data.game_num_rounds !== null) {
        setGame(data.game || ({} as Game));
        setParticipants(data.game.participants || []);
        setRandomGame(data.game_num_random);
        setLeaderView(data.showLeader);
      } else {
        router.push(`/games/${params.uuid}/finished`);
      }
    });

    /**
     * Aquest socket el que fa es setear la llista de participants i si hi ha algun canvi es mostrara gracies a aixó.
     */
    socket.on("participantsLoaders", (data) => {
      setParticipants(data.game.participants || []);
    });

    /**
     * Aquest socket el que fa es setear el leader view, que es quan un joc a acabar i per tant es mostar el leader. I segons si
     * hi ha seguent joc o no es mostrara el seguent joc o el finalitzat.
     */
    socket.on("leader", (data) => {
      setLeaderView(data.showLeader);
    });

    // Limpiar event listeners
    return () => {
      socket.off("inGame");
      socket.off("chargeGame");
      socket.off("leader");
      socket.off("participantsLoaders");
    };
  }, [isAuthenticated, router]);

  /**
   * Aquestes condicionals es per fer aquest random de jocs, tots tenen el participants i la configuració del joc.
   * com son components amb el seus sockets independents no fan cap problema i com son fills d'aquest si hi ha algun canvi en aquest fixer
   * es veura afectat en tots. Aixo s'ha fet aixi per que quan acaba del minijoc es fara un emit de que esta vinculat amb el leader i es mostrara el leader
   * i així es fara aquest cicle de seguent joc ja que en el leader esta el emit, que es un boto per seguent joc i es mostrara el seguent joc
   * o finalitzara el joc.
   */
  if (!game.id || participants.length === 0) {
    return <LoaderComponent />;
  } else if (leaderView) {
    return <LeaderGame game={game} participants={participants} />;
  } else {
    switch (randomGame) {
      case 1:
        return <WordChain participants={participants} game={game} />;
      case 2:
        return <Hangman participants={participants} game={game} />;
      case 3:
        return <Wordle participants={participants} game={game} />;
      default:
        return <Hangman participants={participants} game={game} />;
    }
  }
}
