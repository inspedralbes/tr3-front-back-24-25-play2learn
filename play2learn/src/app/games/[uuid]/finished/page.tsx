"use client";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Medal, Home } from "lucide-react";
import { useEffect, useContext, useState } from "react";
import { AuthenticatorContext } from "@/contexts/AuthenticatorContext";
import { apiRequest } from "@/services/communicationManager/apiRequest";
import { LoaderComponent } from "@/components/LoaderComponent";

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

export default function FinishedGame() {
  const { isAuthenticated } = useContext(AuthenticatorContext);
  const [participantsOrderedByPoints, setParticipantsOrderedByPoints] =
    useState<Participant[]>([]);
  const params = useParams<{ uuid: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/authenticate/login");
      return;
    }
    console.log(params.uuid)
    console.log("wtf")
    apiRequest("/games/lobby/" + params.uuid, "GET").then((response) => {
      console.log(response);
      setParticipantsOrderedByPoints(
        response.game.participants.sort((a: any, b: any) => b.points - a.points)
      );
    }).catch((error) => console.log(error))
  }, [isAuthenticated, router]);

  if (participantsOrderedByPoints.length === 0) {
    return <LoaderComponent />
  } else {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
              ¡Fin del Juego!
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              ¡Felicitaciones a todos los participantes!
            </p>
          </div>

          {/* Podium Section */}
          <div className="relative h-[400px] sm:h-[450px] mb-8">
            {/* Second Place */}
            <div className="absolute left-0 bottom-0 w-1/3 flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={participantsOrderedByPoints[1].user.profile_pic}
                  alt="Second Place"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-silver object-cover"
                />
                <Medal className="absolute -bottom-2 -right-2 w-6 h-6 text-gray-300" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-t-lg w-full text-center">
                <p className="text-white font-semibold text-sm sm:text-base truncate">
                  {participantsOrderedByPoints[1].user.name}
                </p>
                <p className="text-gray-300 text-xs sm:text-sm">
                  {participantsOrderedByPoints[1].points} pts
                </p>
              </div>
              <div className="bg-gray-300/20 h-28 sm:h-32 w-full"></div>
            </div>

            {/* First Place */}
            <div className="absolute left-1/3 bottom-0 w-1/3 flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={participantsOrderedByPoints[0].user.profile_pic}
                  alt="First Place"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 object-cover"
                />
                <Trophy className="absolute -bottom-2 -right-2 w-7 h-7 text-yellow-400" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-3 rounded-t-lg w-full text-center">
                <p className="text-white font-semibold text-sm sm:text-base truncate">
                  {participantsOrderedByPoints[0].user.name}
                </p>
                <p className="text-yellow-400 text-xs sm:text-sm font-bold">
                  {participantsOrderedByPoints[0].points} pts
                </p>
              </div>
              <div className="bg-yellow-400/20 h-40 sm:h-44 w-full"></div>
            </div>

            {/* Third Place */}
            {participantsOrderedByPoints.length >= 3 ? (
              <div className="absolute right-0 bottom-0 w-1/3 flex flex-col items-center">
                <div className="relative mb-2">
                  <img
                    src={participantsOrderedByPoints[2].user.profile_pic}
                    alt="Third Place"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-700 object-cover"
                  />
                  <Medal className="absolute -bottom-2 -right-2 w-6 h-6 text-amber-700" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-t-lg w-full text-center">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">
                    {participantsOrderedByPoints[2].user.name}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {participantsOrderedByPoints[2].points} pts
                  </p>
                </div>
                <div className="bg-amber-700/20 h-24 sm:h-28 w-full"></div>
              </div>
            ) : ('')

            }


            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-fall-slow"></div>
              <div className="absolute top-0 left-2/4 w-2 h-2 bg-purple-400 rounded-full animate-fall-medium"></div>
              <div className="absolute top-0 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-fall-fast"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg 
            flex items-center justify-center gap-2 transition-colors"
              onClick={() => router.push("/")}
            >
              <Home className="w-5 h-5" />
              <span>Volver al Inicio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
