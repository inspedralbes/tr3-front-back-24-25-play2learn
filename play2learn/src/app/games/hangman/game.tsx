"use client";

import { useEffect, useState } from "react";
import socket from "@/services/websockets/socket";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";

interface Player {
  id: number;
  username: string;
}

interface LobbyProps {
  id_language_level: number;
  players: Player[];
  n_rounds: number;
  n_round_actual: number;
  max_powers: number;
  max_guesses: number;
  max_time: number;
}

interface HangmanProps {
  lobbyProps: LobbyProps;
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

const Hangman: React.FC<HangmanProps> = ({ lobbyProps }) => {
  const { isAuthenticated } = useContext(AuthenticatorContext);
  const router = useRouter();

  const [word, setWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [guesses, setGuesses] = useState<number>(0);
  const [powers, setPowers] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

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
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setTime(lobbyProps.max_time);
    setPowers(lobbyProps.max_powers);
  }, []);

  useEffect(() => {
    setGuessedWord("_".repeat(word.length));
  }, [word]);

  useEffect(() => {
    const newTimer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    setTimer(newTimer);

    return () => {
      if (newTimer) {
        clearInterval(newTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (time <= 0) {
      if (timer) {
        clearInterval(timer);
      }
    }
  }, [time]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }

    socket.emit('test');
    socket.on('test', () => {
      console.log('OK');
    });

    return () => {
      socket.off();
  };
  }, [isAuthenticated, router]);

  return (
    <div>
      <h1 className="text-center">Hangman Game</h1>
      <h2 className="text-right">{time}</h2>
      <p className="text-center">{guessedWord.split("").join(" ")}</p>

      <div className="grid grid-cols-7 gap-2">
        {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => (
          <button
            key={letter}
            onClick={() => {
              tryGuess(letter);
            }}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Hangman;
