"use client";
import React, { useState } from "react";
import Hangman from "@/app/games/hangman/game";

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

export default function Home() {
  const [lobbyProps, setLobbyProps] = useState<LobbyProps>({
    id_language_level: 1,
    players: [
      { id: 1, username: "Player1" },
      { id: 2, username: "Player2" },
    ],
    n_rounds: 5,
    n_round_actual: 1,
    max_clues: 3,
    max_guesses: 6,
    max_time: 60,
  });
  
  return <Hangman lobbyProps={lobbyProps} />;
}