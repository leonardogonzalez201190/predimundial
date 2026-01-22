import Prediction from "@/models/Prediction";
import { NextResponse } from "next/server";
import { evaluatePrediction } from "@/lib/score";

export async function GET() {
  try {
    const rows = await Prediction.aggregate([
      // Join con Match
      {
        $lookup: {
          from: "matches",
          localField: "matchId",
          foreignField: "_id",
          as: "match",
        },
      },
      { $unwind: "$match" },

      // Solo partidos con resultado
      { $match: { "match.result": { $ne: null } } },

      // Solo campos necesarios
      {
        $project: {
          homeScore: 1,
          awayScore: 1,
          match: {
            sede: "$match.sede",
            result: "$match.result",
            home: "$match.home", // { name, code, flagUrl }
          },
        },
      },
    ]);

    // Agregar score individual por cada row
    const list = rows.map((r: any) => {
      const score = evaluatePrediction(
        { homeScore: r.homeScore, awayScore: r.awayScore },
        { homeScore: r.match.result.home ?? 0, awayScore: r.match.result.away ?? 0 }
      );

      return {
        sede: r.match.sede,
        result: r.match.result,
        home: r.match.home,
        prediction: {
          homeScore: r.homeScore,
          awayScore: r.awayScore,
        },
        score,
      };
    });

    return NextResponse.json({ list });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error listando predicciones" }, { status: 500 });
  }
}
