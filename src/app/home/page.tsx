import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/User";
import Prediction from "@/models/Prediction";
import Match from "@/models/Match"; // ✅ nuevo
import { evaluatePrediction } from "@/lib/score";
import { redirect } from "next/navigation";

import type { LeanUser, LeanPrediction, MatchResult } from "@/lib/types";
import Link from "next/link";

export default async function RankingPage() {

  const session = await getServerSession(authConfig);

  if (!session) return redirect("/login");

  await connectToDB();

  // ✅ Obtener partidos oficiales directamente desde MongoDB (sin fetch)
  const matchesRaw = await Match.find({ event: session?.user?.event }).lean();

  // Solo partidos que ya tienen resultado
  const officialMatchesWithResults: MatchResult[] = matchesRaw
    .filter((match: any) => match.result !== null)
    .map((match: any) => ({
      id: match._id.toString(), // si tu modelo tiene "id"
      group: match.group,
      date: match.datetime ? new Date(match.datetime).toISOString().split("T")[0] : "",
      time: match.datetime ? new Date(match.datetime).toISOString().split("T")[1].slice(0, 5) : "",
      venue: match.sede,
      status: match.status,
      result: match.result,
      home: match.home,
      away: match.away,
    }));

  // Obtener usuarios
  const usersRaw = await User.find().lean<LeanUser[]>();
  const users = usersRaw.map((user: LeanUser) => ({
    id: user._id!.toString(),
    alias: user.alias,
  }));

  // Obtener predicciones
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
    <div className="w-full px-4 sm:px-0 space-y-4">
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
            <th className="p-2 text-center">Puntos</th>
            <th className="p-2 text-center">Predicciones</th>
            <th className="text-end p-2">Detalles</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((userRanking, index) => (
            <tr key={userRanking.id} className="border-b">
              <td className="p-2 font-bold">{index + 1}</td>
              <td className="p-2">{userRanking.alias}</td>
              <td className="p-2 text-center font-bold">{userRanking.points}</td>
              <td className="p-2 text-center">{userRanking.predictions}</td>
              <td className="p-2 text-end">
                <Link
                  className="text-blue-500 hover:text-blue-600"
                  href={`/details?userId=${userRanking.id}`}
                >
                  Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
