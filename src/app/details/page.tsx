import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/database";
import type { LeanPrediction, LeanUser } from "@/lib/types";
import Prediction from "@/models/Prediction";
import Image from "next/image";
import User from "@/models/User";
import Match from "@/models/Match";
import { evaluatePrediction } from "@/lib/score";
import mongoose from "mongoose";

export default async function DetailsPage({ searchParams }: { searchParams: { userId: string } }) {
    const { userId } = await searchParams;

    const session = await getServerSession(authConfig);
    if (!session?.active) return redirect("/login");

    await connectToDB();

    const user = await User.findById(userId).select("username alias").lean<LeanUser>();

    const rows = await Prediction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
                    away: "$match.away", // { name, code, flagUrl }
                },
            },
        },
    ]);

    // Agregar score individual por cada row
    let totalScore = 0;
    const list = rows.map((r: any) => {
        const score = evaluatePrediction(
            { homeScore: r.homeScore, awayScore: r.awayScore },
            { homeScore: r.match.result.home ?? 0, awayScore: r.match.result.away ?? 0 }
        );

        totalScore += score;

        return {
            _id: r._id.toString(),
            sede: r.match.sede,
            result: r.match.result,
            home: r.match.home,
            away: r.match.away,
            prediction: {
                homeScore: r.homeScore,
                awayScore: r.awayScore,
            },
            score,
        };
    });

    return (
        <div className="flex flex-col flex-auto gap-3 p-4">
            <h1 className="whitespace-nowrap truncate grid grid-cols-[auto_1fr_auto] items-center gap-1">
                <span className="font-bold text-xl truncate">{user?.username}</span>
                <span className="text-muted-foreground font-light text-sm pt-1.5 truncate">({user?.alias})</span>
                <span className="text-muted-foreground font-light text-sm pt-1.5 truncate">Total: {totalScore}</span>
            </h1>
            {list.length === 0 ? (
                <p className="text-center text-muted-foreground flex-1 flex auto items-center justify-center">
                    No hay partidos finalizados para mostrar
                </p>
            ) : (
                list.map((item: any) => (
                    <div
                        key={item._id}
                        className="bg-secondary rounded-lg p-3 space-y-3"
                    >
                        {/* Header */}
                        <div className="text-xs flex justify-between">
                            <span>
                                {item.home.name} vs {item.away.name}
                            </span>

                            {item.result && (
                                <div className="text-xs text-green-600 font-semibold">
                                    Final: {item.result.home} - {item.result.away} (+{item.score})
                                </div>
                            )}
                        </div>

                        {/* Grid partido */}
                        <div className="grid grid-cols-7 gap-2 items-center text-center">
                            {/* Home + texto debajo */}
                            <div className="flex flex-col justify-center items-center col-span-2">
                                <Image
                                    src={item.home.flagUrl}
                                    alt={item.home.name}
                                    width={44}
                                    height={32}
                                />
                                <span className="text-xs sm:text-sm font-semibold mt-1 truncate">
                                    {item.home.name}
                                </span>
                            </div>

                            {/* Score local */}
                            <div className="font-bold text-lg">
                                {item.prediction ? item.prediction.homeScore : "-"}
                            </div>

                            {/* Separador */}
                            <div className="font-bold text-lg">–</div>

                            {/* Score visitante */}
                            <div className="font-bold text-lg">
                                {item.prediction ? item.prediction.awayScore : "-"}
                            </div>

                            {/* Visitante + texto debajo */}
                            <div className="flex flex-col justify-center items-center col-span-2">
                                <Image
                                    src={item.away.flagUrl}
                                    alt={item.away.name}
                                    width={44}
                                    height={32}
                                />
                                <span className="text-xs sm:text-sm font-semibold mt-1 truncate">
                                    {item.away.name}
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}