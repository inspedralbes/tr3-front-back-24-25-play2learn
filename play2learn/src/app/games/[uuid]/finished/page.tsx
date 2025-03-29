"use client"
import { useParams } from "next/navigation";

export default function FinishedGame() {
  const params = useParams<{ uuid: string }>();
  return <div>Finished Game</div>;
}