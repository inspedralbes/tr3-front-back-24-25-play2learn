"use client";
import React, { use } from "react";
import { useState, useEffect } from "react";

interface Player {
  id: number;
  username: string;
}

interface LobbyProps {
  id_language_level: number;
  players: Player[];
  n_rounds: number;
  n_round_actual: number;
  max_clues: number;
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
  const [word, setWord] = useState<string>("");
  const [guessedWord, setGuessedWord] = useState<string>("");
  const [guesses, setGuesses] = useState<number>(0);
  const [clues, setClues] = useState<number>(0);
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
  }

  useEffect(() => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setTime(lobbyProps.max_time);
    setClues(lobbyProps.max_clues);
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

  return (
    <div>
      <h1 className="text-center">Hangman Game</h1>
      <h2 className="text-right">{ time }</h2>
      <p className="text-center">{ guessedWord.split("").join(" ") }</p>

      <div className="grid grid-cols-7 gap-2">
        {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => (
          <button key={letter} onClick={()=> {
            tryGuess(letter);
          }}>{ letter }</button>
        ))}
      </div>
    </div>
  );
};

export default Hangman;
