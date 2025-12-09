"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger
} from "@/components/ui/drawer";
import Image from "next/image";

import type { UserPredictionDrawerProps } from "@/lib/types";

export default function UserPredictionsDrawer({
  username,
  matches,
  predictions
}: UserPredictionDrawerProps) {
  const entries = matches.map((match: any) => {
    const prediction = predictions.find((p: any) => p.matchId === match.id);
    return { match, prediction };
  });

  return (
    <Drawer direction="right">
      <DrawerTrigger className="text-blue-600 hover:underline">
        Ver detalles
      </DrawerTrigger>

      <DrawerContent
        className="p-6 space-y-4 max-h-screen overflow-y-auto overflow-x-hidden"
      >
        <DrawerTitle className="text-xl font-bold flex items-center justify-between">
          <h1>{username}</h1>
          <p className="text-muted-foreground text-sm">Predicciones</p>
        </DrawerTitle>

        <div className="flex flex-col gap-3">
          {entries.map(({ match, prediction }: any) => (
            <div
              key={match.id}
              className="bg-secondary rounded-lg p-3 space-y-3"
            >
              {/* Header */}
              <div className="text-xs flex justify-between">
                <span>
                  {match.home.name} vs {match.away.name}
                </span>

                {match.result && (
                  <div className="text-xs text-green-600 font-semibold">
                    Final: {match.result.home} - {match.result.away}
                  </div>
                )}
              </div>

              {/* Grid partido */}
              <div className="grid grid-cols-7 gap-2 items-center text-center">
                {/* Home + texto debajo */}
                <div className="flex flex-col justify-center items-center col-span-2">
                  <Image
                    src={match.home.flagUrl}
                    alt={match.home.name}
                    width={44}
                    height={32}
                  />
                  <span className="text-xs sm:text-sm font-semibold mt-1 truncate">
                    {match.home.name}
                  </span>
                </div>

                {/* Score local */}
                <div className="font-bold text-lg">
                  {prediction ? prediction.homeScore : "-"}
                </div>

                {/* Separador */}
                <div className="font-bold text-lg">–</div>

                {/* Score visitante */}
                <div className="font-bold text-lg">
                  {prediction ? prediction.awayScore : "-"}
                </div>

                {/* Visitante + texto debajo */}
                <div className="flex flex-col justify-center items-center col-span-2">
                  <Image
                    src={match.away.flagUrl}
                    alt={match.away.name}
                    width={44}
                    height={32}
                  />
                  <span className="text-xs sm:text-sm font-semibold mt-1 truncate">
                    {match.away.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
