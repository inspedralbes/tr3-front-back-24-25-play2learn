"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { Clock, Heart, Keyboard, User, Clock3 } from "lucide-react";
import socket from "@/services/websockets/socket";

interface Player {
  id: number;
  username: string;
  rol: string;
}

interface LobbyProps {
  id_language_level: number;
  players: Player[];
  max_powers: number;
  max_time: number;
}

const Hangman: React.FC = () => {
  const params = useParams<{ uuid: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useContext(AuthenticatorContext);

  const [lobbyProps, setLobbyProps] = useState<LobbyProps | null>(null);
  const [word, setWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [turnUserId, setTurn] = useState<number>(0);
  const [guesses, setGuesses] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [inputLetter, setInputLetter] = useState<string>("");
  const [inputWord, setInputWord] = useState<string>("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getUsername = (id: number) => {
    const player = lobbyProps?.players.find((player) => player.id === id);

    return player?.username || "Desconocido";
  };

  const drawHangman = (attempts: number) => {
    return (
      <div>
        <p>muñeco</p>
      </div>
    );
  };

  const hostPlayer = lobbyProps?.players.find(
    (player) => player.rol === "host"
  );

  const isMyTurn = turnUserId === user?.id;

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

      setGuessedWord(newGuessedWord);
    } else {
      acierto = false;
    }
    setInputLetter("");
    socket.emit("nextTurn", { roomUUID: params.uuid, acierto: acierto, newGuessedWord: newGuessedWord });
  };

  const wordGuess = () => {
    let acierto = true;
    let newGuessedWord = "";

    if (word === inputWord) {
      setGuessedWord(inputWord);
      newGuessedWord = inputWord;
    } else {
      acierto = false;
    }
    setInputWord("");
    socket.emit("nextTurn", { roomUUID: params.uuid, acierto: acierto, newGuessedWord: newGuessedWord });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    const fetchGameData = async () => {
      try {
        const response = await apiRequest(`/games/${params.uuid}`, "GET");
        const data = response.game;

        const p = data.participants.map(
          (player: {
            user_id: number;
            user: { username: string };
            rol: string;
          }) => ({
            id: player.user_id,
            username: player.user.username,
            rol: player.rol,
          })
        );

        setLobbyProps({
          id_language_level: data.id_level_language,
          players: p,
          max_powers: data.max_clues,
          max_time: data.max_time,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameData();

    socket.emit("getWordHangman", { roomUUID: params.uuid });
    socket.emit("getTurn", { roomUUID: params.uuid });

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
      console.log("newGuessedWord", newGuessedWord);
      setGuessedWord(newGuessedWord);
    });

    return () => {
      socket.off("wordHangman");
      socket.off("turn");
      socket.off("newGuessedWord");
    };
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (lobbyProps === null) return;

    if (hostPlayer?.id === user?.id)
      socket.emit("startTimer", {
        roomUUID: params.uuid,
        maxTime: lobbyProps.max_time,
      });

    socket.on("timerTick", ({ time }) => {
      console.log(time);
      setTime(time);
    });

    return () => {
      socket.off("timerTick");
    };
  }, [lobbyProps]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span className="text-xl font-bold">{user?.username}</span>
            <div className="text-xl font-bold">{word}</div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-6 h-6" />
              <span className="text-xl">{formatTime(time ?? 0)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6" />
              <span className="text-xl">{guesses} errores</span>
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
          <div className="flex justify-center mb-8">{drawHangman(guesses)}</div>

          <div className="text-center mb-12">
            <p className="text-6xl font-mono tracking-widest">{guessedWord}</p>
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
};

export default Hangman;
