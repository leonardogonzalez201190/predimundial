"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import Image from "next/image";

type MatchData = {
  id: string;
  home: { name: string; flagUrl: string };
  away: { name: string; flagUrl: string };
  result?: { homeScore: number; awayScore: number } | null;
};

type UserPrediction = {
  matchId: string;
  homeScore: number;
  awayScore: number;
};

type Props = {
  username: string;
  matches: MatchData[];
  predictions: UserPrediction[];
};

export default function UserPredictionsDrawer({ username, matches, predictions }: Props) {
  // Emparejar partidos con predicciones
  const entries = matches.map(match => {
    const prediction = predictions.find(p => p.matchId === match.id);
    return { match, prediction };
  });

  return (
    <Drawer direction="right">
      <DrawerTrigger className="text-blue-600 underline cursor-pointer">
        Ver detalles
      </DrawerTrigger>

      <DrawerContent className="p-6 space-y-4">
        <DrawerTitle className="text-xl font-bold">{username}</DrawerTitle>
        <DrawerDescription className="text-sm text-muted-foreground">
          Predicciones del usuario
        </DrawerDescription>

        <div className="flex flex-col gap-4">
          {entries.map(({ match, prediction }) => (
            <div
              key={match.id}
              className="border rounded-lg p-4 bg-card space-y-4"
            >
              {/* Header del partido */}
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>
                  {match.home.name} vs {match.away.name}
                </span>

                {match.result && (
                  <div className="text-xs text-green-600 font-semibold">
                    Final: {match.result.homeScore} - {match.result.awayScore}
                  </div>
                )}
              </div>

              {/* Filas de equipos + predicción */}
              <div className="grid grid-cols-7 gap-2 items-center text-center">
                {/* Local */}
                <div className="flex justify-center">
                  <Image
                    src={match.home.flagUrl}
                    alt={match.home.name}
                    width={44}
                    height={32}
                  />
                </div>
                <div className="font-semibold text-xs sm:text-sm truncate">
                  {match.home.name}
                </div>

                {/* Predicción local */}
                <div className="font-bold text-lg">
                  {prediction ? prediction.homeScore : "-"}
                </div>

                {/* Separador */}
                <div className="font-bold text-lg">–</div>

                {/* Predicción visitante */}
                <div className="font-bold text-lg">
                  {prediction ? prediction.awayScore : "-"}
                </div>

                {/* Visitante */}
                <div className="font-semibold text-xs sm:text-sm truncate">
                  {match.away.name}
                </div>
                <div className="flex justify-center">
                  <Image
                    src={match.away.flagUrl}
                    alt={match.away.name}
                    width={44}
                    height={32}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
