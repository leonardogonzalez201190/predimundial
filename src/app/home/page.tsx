import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { connectToDB } from "@/lib/database";
import Prediction from "@/models/Prediction";
import { evaluatePrediction } from "@/lib/score";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function RankingPage() {

  const session = await getServerSession(authConfig);

  if (!session?.active) return redirect("/login");

  await connectToDB();

  const predictions = await Prediction.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    {
      $lookup: {
        from: "matches",
        localField: "matchId",
        foreignField: "_id",
        as: "match",
      },
    },
    { $unwind: "$match" },

    {
      $match: {
        // "match.result": { $ne: null },
        "match.event": session?.user?.event,
      },
    },

    {
      $project: {
        homeScore: 1,
        awayScore: 1,
        "user._id": 1,
        "user.alias": 1,
        "match.result": 1,
        "match.event": 1,
      },
    },
  ]);

  const userScored: Record<string, any> = {};

  for (const p of predictions) {
    const userId = p.user._id.toString();

    if (!userScored[userId]) {
      userScored[userId] = {
        predictions: 0,
        alias: p.user.alias,
        score: 0,
      };
    }

    const score = p.match.result ? evaluatePrediction(
      { homeScore: p.homeScore, awayScore: p.awayScore },
      { homeScore: p.match.result.home ?? 0, awayScore: p.match.result.away ?? 0 }
    ) : 0;

    userScored[userId].score += score;
    userScored[userId].predictions += 1;
  }

  const ranking = Object.entries(userScored)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="w-full px-4 sm:px-0 space-y-4">
      <div className="text-sm text-muted-foreground p-3 bg-card border rounded-md">
        El ranking estará disponible a medida que los partidos se vayan cerrando.
        Una vez finalizados los encuentros y publicados los resultados oficiales,
        podrás ver las puntuaciones actualizadas y compararlas con otros participantes.
      </div>

      <h2 className="text-sm font-bold truncate">Ranking General</h2>

      <table className="w-full bg-card">
        <thead className="border-b text-card-foreground bg-muted">
          <tr>
            <th className="p-1 text-center">#</th>
            <th className="p-1 px-2 text-left">Alias</th>
            <th className="p-1 text-center">Puntos</th>
            <th className="p-1 text-center">Predicciones</th>
            <th className="text-end p-1">Detalles</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((userRanking, index) => (
            <tr key={userRanking.userId} className="border-b">
              <td className="p-1 text-center px-2 font-bold">{index + 1}</td>
              <td className="p-1 px-2">{userRanking.alias}</td>
              <td className="p-1 px-2 text-center font-bold">{userRanking.score}</td>
              <td className="p-1 px-2 text-center">{userRanking.predictions}</td>
              <td className="p-1 px-2 text-end">
                <Link
                  className="text-blue-500 hover:text-blue-600"
                  href={`/details?userId=${userRanking.userId}`}
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
