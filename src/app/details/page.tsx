import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/database";
import type { LeanPrediction, LeanUser, MatchResult } from "@/lib/types";
import Prediction from "@/models/Prediction";
import Image from "next/image";
import User from "@/models/User";

export default async function DetailsPage({ searchParams }: { searchParams: { userId: string } }) {
    const { userId } = await searchParams;

    const session = await getServerSession(authConfig);
    if (!session) return redirect("/login");

    await connectToDB();

    // Obtener partidos oficiales
    const matchesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`,
        { cache: "no-store" }
    );

    const user = await User.findById(userId).select("username alias").lean<LeanUser>();
    const matchesData = await matchesResponse.json();

    const matches: MatchResult[] = matchesData.groups
        .flatMap((group: any) => group.matches)
        .filter((match: any) => match.result !== null);

    // Obtener predicciones tipadas
    const predsRaw = await Prediction.find({ userId }).lean<LeanPrediction[]>();

    const entries = matches.map((match: any) => {
        const prediction = predsRaw.find((p: any) => p.matchId === match.id);
        return { match, prediction };
    });

    return (
        <div className="flex flex-col gap-3">
            <header className="text-xl font-bold flex items-center justify-between">
                <h1 className="whitespace-nowrap truncate">
                    {user?.username}/
                    <span className="text-muted-foreground font-light">({user?.alias})</span>
                </h1>
                <p className="text-muted-foreground text-sm">Predicciones</p>
            </header>
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
    );
}