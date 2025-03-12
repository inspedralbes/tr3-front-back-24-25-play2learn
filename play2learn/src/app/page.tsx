"use client";
import {AuthContext} from "@/contexts/AuthContext";
import { useContext } from "react";

import GameLobby from "@/components/gameLobby";
import GameSelection from "@/components/gameSelection";
import ProfileSection from "@/components/profileSection";

export default function Home() {
  const { activeSection } = useContext(AuthContext);

  return (
    <>
      {activeSection === 'lobby' && <GameLobby />}
      {activeSection === 'games' && <GameSelection />}
      {activeSection === 'profile' && <ProfileSection />}
    </>
  );
}
