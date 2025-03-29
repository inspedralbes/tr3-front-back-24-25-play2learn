"use client";
import { useEffect, useState, useContext, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { Clock, X, Keyboard, User, Clock3 } from "lucide-react";
import socket from "@/services/websockets/socket";

interface Participant {
  id: number;
  user_id: number;
  user: User;
  rol: string;
  points: number;
}

interface Player extends Participant {
  isActive: boolean;
  word: string;
  localPoints: number;
  time: number;
}

interface User {
  id: number;
  name: string;
  username: string;
  profile_pic: string;
}

interface LanguageLevel {
  id: number;
  language_id: number;
  language: Language;
  level: string;
}

interface Language {
  id: number;
  name: string;
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

const POINTS_PER_CORRECT_LETTER = 50;
const POINTS_PER_CORRECT_WORD = 250;
const POINTS_PENALTY_LETTER = -25;
const POINTS_PENALTY_WORD = -150;
const POINTS_PENALTY_NO_RESPONSE = -5;

export default function Hangman({
  participants,
  game,
}: {
  participants: Participant[];
  game: Game;
}) {
  const uuid = game.uuid;
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthenticatorContext);
  const [word, setWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [turnUserId, setTurn] = useState<number>(0);
  const [guesses, setGuesses] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [inputLetter, setInputLetter] = useState<string>("");
  const [inputWord, setInputWord] = useState<string>("");
  const [points, setPoints] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPlayer = (id: number) => {
    return participants.find((player) => player.user.id === id);
  };

  const getUsername = (id: number) => {
    const player = getPlayer(id);

    return player?.user.username || "Desconocido";
  };
  const drawHangman = (attempts: number) => {
    let hangman = null;

    switch (attempts) {
      case 0:
        hangman = hangman = `
 +---+
 |   |
     |
     |
     |
=========`;
      case 1:
        hangman = `
 +---+
 |   |
 O   |
     |
     |
=========`;
        break;
      case 2:
        hangman = `
 +---+
 |   |
 O   |
 |   |
     |
=========`;
        break;
      case 3:
        hangman = `
 +---+
 |   |
 O   |
/|\  |
     |
=========`;
        break;
      case 4:
        hangman = `
 +---+
 |   |
 O   |
/|\  |
/    |
=========`;
        break;
      default:
        hangman = `
 +---+
 |   |
 O   |
/|\\  |
/ \\  |
=========`;
    }
    return <pre className="font-mono text-4xl whitespace-pre">{hangman}</pre>;
  };
  //   const drawHangman = (attempts: number) => {
  //     return (
  //       <div>
  //         <p>muñeco</p>
  //       </div>
  //     );
  //   };

  const hostPlayer = game.participants?.find((player) => player.rol === "host");

  const isMyTurn = turnUserId === user?.id;

  const setPointsUsers = (points: number) => {
    const player = getPlayer(turnUserId);

    if (player) {
      if (player.user_id === user?.id) {
        setPoints((prevPoints) => prevPoints + points);
        console.log("---------------------");
        console.log("Turno: ", turnUserId);
        console.log("Seteando puntos a jugador: ", player.user.username);
        console.log("Puntos actuales: ", player.points);
        player.points += points;
        console.log("Puntos modificados: ", player.points);
        console.log("---------------------");
      }
    } else console.log("no se encontro el jugador");
  };

  const letterGuess = () => {
    let acierto = true;
    let newGuessedWord = "";
    if (!guessedWord.includes(inputLetter) && word.includes(inputLetter)) {
      newGuessedWord = word
        .split("")
        .map((letter, index) =>
          letter === inputLetter ? letter : guessedWord[index]
        )
        .join("");

      setPointsUsers(POINTS_PER_CORRECT_LETTER);
      setGuessedWord(newGuessedWord);
    } else {
      setPointsUsers(POINTS_PENALTY_LETTER);
      acierto = false;
    }

    setInputLetter("");
    socket.emit("nextTurn", {
      roomUUID: uuid,
      acierto: acierto,
      newGuessedWord: newGuessedWord,
    });
  };

  const wordGuess = () => {
    let acierto = true;
    let newGuessedWord = "";

    if (word === inputWord) {
      setPointsUsers(POINTS_PER_CORRECT_WORD);
      setGuessedWord(inputWord);
      newGuessedWord = inputWord;
    } else {
      setPointsUsers(POINTS_PENALTY_WORD);
      acierto = false;
    }

    setInputWord("");
    socket.emit("nextTurn", {
      roomUUID: uuid,
      acierto: acierto,
      newGuessedWord: newGuessedWord,
    });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    socket.emit("getWordHangman", { roomUUID: uuid });
    socket.emit("getTurn", { roomUUID: uuid });

    if (hostPlayer?.user_id === user?.id) {
      socket.emit("startTimer", {
        roomUUID: uuid,
        maxTime: game.max_time,
      });
    }

    socket.on("wordHangman", ({ newWord }) => {
      if (newWord && newWord.length > 0) {
        setWord(newWord);
        setGuessedWord("_".repeat(newWord.length));
      }
    });
    socket.on("turn", ({ turn, errors }) => {
      setTurn(turn.user_id);
      setGuesses(errors);
    });
    socket.on("newGuessedWord", ({ newGuessedWord }) => {
      setGuessedWord(newGuessedWord);
    });
    socket.on("timerTick", ({ time }) => {
      setTime(time);
    });

    return () => {
      socket.off("wordHangman");
      socket.off("turn");
      socket.off("newGuessedWord");
      socket.off("timerTick");
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (turnUserId === 0) return;

    // socket.on("timeOut", () => {
    //   setPointsUsers(POINTS_PENALTY_NO_RESPONSE);
    // });
    socket.on("gameOver", () => {
      const player = getPlayer(user?.id || 0);
      console.log(player);
      console.log("Puntos: ", points);
      router.push(`/`);
    });

    return () => {
      //   socket.off("timeOut");
      socket.off("gameOver");
    };
  }, [turnUserId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="text-lg sm:text-xl font-bold text-white">
              {user?.username}
            </span>
            <div className="text-lg sm:text-xl font-bold text-white">
              {word}
            </div>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-lg sm:text-xl text-white">
                {formatTime(time ?? 0)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="text-lg sm:text-xl text-white">
                {guesses} errores
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isMyTurn ? "bg-green-500/20" : "bg-yellow-500/20"
            }`}
          >
            <Clock3 className="w-5 h-5" />
            <span>
              {isMyTurn
                ? "Tu turno"
                : `Turno de ${getUsername(turnUserId ?? 0)}`}
            </span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-xl">
          <div className="flex justify-center items-center mb-8 sm:mb-12 text-white transform scale-75 sm:scale-90 md:scale-100">
            {drawHangman(guesses)}
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <p className="text-4xl sm:text-5xl md:text-6xl font-mono tracking-widest text-white break-all">
              {guessedWord}
            </p>
          </div>

          <div
            className={`space-y-6 ${
              !isMyTurn
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <input
                type="text"
                maxLength={1}
                value={inputLetter}
                onChange={(e) => setInputLetter(e.target.value)}
                className="w-16 h-16 text-center text-xl sm:text-2xl bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                placeholder="A"
                disabled={!isMyTurn}
              />
              <button
                onClick={() => letterGuess()}
                className="w-full sm:w-auto px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                disabled={!isMyTurn}
              >
                Adivinar Letra
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="w-full sm:w-48 h-12 px-4 text-center bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                placeholder="Palabra completa"
                disabled={!isMyTurn}
              />
              <button
                onClick={() => wordGuess()}
                className="w-full sm:w-auto px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                disabled={!isMyTurn}
              >
                Adivinar Palabra
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Keyboard className="w-8 h-8" />
            <span className="ml-2">Use su teclado para jugar</span>
          </div>

          {!isMyTurn && (
            <div className="mt-6 text-center text-yellow-200">
              <p>Esperando tu turno...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
