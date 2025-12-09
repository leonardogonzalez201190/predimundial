import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/User";
import Prediction from "@/models/Prediction";
import { evaluatePrediction } from "@/lib/score";
import { redirect } from "next/navigation";
import UserPredictionsDrawer from "@/components/UserPredictionsDrawer";

import type { LeanUser, LeanPrediction, MatchResult } from "@/lib/types";

export default async function RankingPage() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");

  await connectToDB();

  // Obtener partidos oficiales
  const matchesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`,
    { cache: "no-store" }
  );

  const matchesData = await matchesResponse.json();

  const officialMatchesWithResults: MatchResult[] = matchesData.groups
    .flatMap((group: any) => group.matches)
    .filter((match: any) => match.result !== null);

  // Obtener usuarios con tipado explícito en el map
  const usersRaw = await User.find().lean<LeanUser[]>();
  const users = usersRaw.map((user: LeanUser) => ({
    id: user._id!.toString(),
    alias: user.alias,
  }));

  // Obtener predicciones tipadas
  const predsRaw = await Prediction.find().lean<LeanPrediction[]>();
  const predictions = predsRaw.map((p: LeanPrediction) => ({
    id: p._id!.toString(),
    userId: p.userId!.toString(),
    homeScore: p.homeScore,
    awayScore: p.awayScore,
    matchId: p.matchId,
  }));

  // Calcular ranking
  const ranking = users.map((user) => {
    const userPredictions = predictions.filter(
      (prediction) => prediction.userId === user.id
    );

    let totalPoints = 0;
    let matchesCount = 0;

    userPredictions.forEach((prediction) => {
      const match = officialMatchesWithResults.find(
        (match) => match.id === prediction.matchId
      );
      if (!match) return;

      totalPoints += evaluatePrediction(
        { homeScore: prediction.homeScore, awayScore: prediction.awayScore },
        {
          homeScore: match.result.home ?? 0,
          awayScore: match.result.away ?? 0,
        }
      );

      matchesCount++;
    });

    return {
      id: user.id,
      alias: user.alias,
      predictions: matchesCount,
      points: totalPoints,
    };
  });

  // Ordenar por puntos desc
  ranking.sort((a, b) => b.points - a.points);

  return (
    <div className="w-full px-4 sm:px-0">
      <h1 className="font-bold py-4">Ranking General</h1>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-sm text-card-foreground bg-muted">
            <th className="py-2">#</th>
            <th className="py-2">Alias</th>
            <th className="py-2">Predicciones</th>
            <th className="py-2">Puntos</th>
            <th className="text-end p-2">Detalles</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((userRanking, index) => (
            <tr key={userRanking.id} className="border-b text-sm">
              <td className="py-2 font-bold">{index + 1}</td>
              <td className="py-2">{userRanking.alias}</td>
              <td className="py-2">{userRanking.predictions}</td>
              <td className="py-2 font-bold">{userRanking.points}</td>
              <td className="p-2 text-end">
                <UserPredictionsDrawer
                  username={userRanking.alias}
                  matches={officialMatchesWithResults}
                  predictions={predictions.filter(
                    (prediction) => prediction.userId === userRanking.id
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
