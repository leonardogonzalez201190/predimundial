import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import User from "@/models/User";
import Prediction from "@/models/Prediction";
import { evaluatePrediction } from "@/lib/score";
import { MatchesResponse } from "@/lib/types";
import { redirect } from "next/navigation";
import UserPredictionsDrawer from "@/components/UserPredictionsDrawer";

interface LeanUser {
  _id: string | { toString(): string };
  alias: string;
}

interface LeanPrediction {
  _id: string | { toString(): string };
  userId?: string | { toString(): string };
  homeScore: number;
  awayScore: number;
  matchId: string;
}

export default async function RankingPage() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/login");

  await connectToDB();

  // Obtener partidos oficiales
  const matchesRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`,
    { cache: "no-store" }
  );

  const matchesData: MatchesResponse = await matchesRes.json();

  const allMatchesWithResults = matchesData.groups
    .flatMap((g) => g.matches)
    .filter((m) => m.result !== null);

  // Obtener usuarios tipados
  const usersRaw = await User.find().lean<LeanUser[]>();
  const users = usersRaw.map((u) => ({
    ...u,
    _id: u._id.toString(),
  }));

  // Obtener predicciones tipadas
  const predsRaw = await Prediction.find().lean<LeanPrediction[]>();
  const predictions = predsRaw.map((p) => ({
    ...p,
    userId: p.userId?.toString() ?? "",
  }));

  // Construir ranking
  const ranking = users.map((user) => {
    const userPredictions = predictions.filter(
      (p) => p.userId === user._id
    );

    let totalPoints = 0;
    let matchesCount = 0;

    userPredictions.forEach((pred) => {
      const match = allMatchesWithResults.find(
        (m) => m.id === pred.matchId
      );
      if (!match) return;

      totalPoints += evaluatePrediction(
        { homeScore: pred.homeScore, awayScore: pred.awayScore },
        {
          homeScore: match.result!.home ?? 0,
          awayScore: match.result!.away ?? 0,
        }
      );

      matchesCount++;
    });

    return {
      _id: user._id,
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
            <th className="text-end p-2">Details</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((r, i) => (
            <tr key={i} className="border-b text-sm">
              <td className="py-2 font-bold">{i + 1}</td>
              <td className="py-2">{r.alias}</td>
              <td className="py-2">{r.predictions}</td>
              <td className="py-2 font-bold">{r.points}</td>
              <td className="p-2 text-end">
                <UserPredictionsDrawer
                  username={r.alias}
                  matches={allMatchesWithResults}
                  predictions={predictions.filter((p) => p.userId === r._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
