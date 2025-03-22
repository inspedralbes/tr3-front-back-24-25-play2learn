"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useContext, use } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import socket from "@/services/websockets/socket";
import { apiRequest } from "@/services/communicationManager/apiRequest";

interface Player {
  id: number;
  username: string;
}

interface LobbyProps {
  id_language_level: number;
  players: Player[];
  max_powers: number;
  max_time: number;
}

const WORDS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
];

const Hangman: React.FC = () => {
  const params = useParams<{ uuid: string }>();
  const router = useRouter();
  const { isAuthenticated } = useContext(AuthenticatorContext);

  const [word, setWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [guesses, setGuesses] = useState<number>(0);
  const [time, setTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameStatus, setStatus] = useState<string>("iniciado");
  const [round, setRound] = useState<number>(1);
  const [lobbyProps, setLobbyProps] = useState<LobbyProps | null>(null);

  const tryGuess = (letter: string) => {
    if (word.includes(letter)) {
      const newGuessedWord = Array.from(guessedWord);
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          newGuessedWord[i] = letter;
        }
      }
      setGuessedWord(newGuessedWord.join(""));
    } else {
      setGuesses((prevGuesses) => prevGuesses + 1);
    }
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

        setLobbyProps({
          id_language_level: data.id_level_language,
          players: data.participants,
          max_powers: data.max_clues,
          max_time: data.max_time,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameData();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (lobbyProps === null) return;

    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }, [lobbyProps]);

  useEffect(() => {
    setGuessedWord("_".repeat(word.length));
  }, [word]);

  // useEffect(() => {
  //   setTime(lobbyProps?.max_time || 0);

  //   const timer = setInterval(() => {
  //     setTime((prevTime) => prevTime - 1);
  //   }, 1000);

  //   setTimer(timer);
  // }, [turno]);

  useEffect(() => {
    if (word === "") return;

    if (guessedWord === word || guesses >= 6) {
      if (round === lobbyProps?.players.length) {
        setStatus("finalizado");
      } else {
        setRound((prevRound) => prevRound + 1);
        setGuesses(0);
      }
    }
  }, [guessedWord, guesses]);

  useEffect(() => {
    if (time === null) return;

    if (time === 0) {
      // pasar siguiente turno, no ronda
    }
  }, [time]);
  return (
    <div className="h-full flex flex-col gap-4">
      <h1 className="text-center">Hangman Game</h1>

      {gameStatus}
      {gameStatus === "iniciado" && (
        <div className="h-full">
          <div className="fixed top-0 right-0 p-4">
            <h2>Round {round}</h2>
            <h3>Guesses: {guesses}</h3>
            <h3>Time: {time}</h3>
          </div>
          <div className="h-full flex flex-row justify-center gap-4">
            <div className="flex flex-col gap-4 border-2 border-black p-4 w-1/2">
                <div className="text-center border-b-2 border-black p-4 w-full">
                {guessedWord.split("").join(" ")}
                </div>
              <div className="">
                {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => (
                  <button key={letter} onClick={() => tryGuess(letter)}>
                    {letter}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-1/2 border-2 border-black p-4 text-center">
              <p>imagen</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hangman;
