import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/User";
import Prediction from "@/models/Prediction";
import { evaluatePrediction } from "@/lib/score";
import { redirect } from "next/navigation";
import UserPredictionsDrawer from "@/components/UserPredictionsDrawer";

import type { LeanUser, LeanPrediction, MatchResult } from "@/lib/types";
import Link from "next/link";

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
    <div className="w-full p-4 sm:px-0 space-y-4">

      <div className="text-sm text-muted-foreground p-3 bg-card border rounded-md">
        El ranking estará disponible a medida que los partidos se vayan cerrando.
        Una vez finalizados los encuentros y publicados los resultados oficiales,
        podrás ver las puntuaciones actualizadas y compararlas con otros participantes.
      </div>

      <h1 className="font-bold">Ranking General</h1>

      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b text-card-foreground bg-muted">
            <th className="p-2">#</th>
            <th className="p-2">Alias</th>
            <th className="p-2">Predicciones</th>
            <th className="p-2">Puntos</th>
            <th className="text-end p-2">Detalles</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((userRanking, index) => (
            <tr key={userRanking.id} className="border-b">
              <td className="p-2 font-bold">{index + 1}</td>
              <td className="p-2 truncate">{userRanking.alias}</td>
              <td className="p-2">{userRanking.predictions}</td>
              <td className="p-2 font-bold">{userRanking.points}</td>
              <td className="p-2 text-end">
                <Link
                  className="text-blue-500 hover:text-blue-600"
                  href={`/details?userId=${userRanking.id}`}
                >Ver detalles</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
