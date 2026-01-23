import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDB } from "@/lib/database";
import Match from "@/models/Match";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
    const session = await getServerSession(authConfig);
    if (!session?.user) redirect("/login");

    await connectToDB();

    const matches = await Match.find({ event: session?.user?.event }).lean();

    return (
        <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Admin
                </h1>
                <span className="text-muted-foreground text-sm">
                    Cerrar partidos
                </span>
            </div>
            <div className="space-y-3">
                {matches.map((match, index) => {
                    const matchId = match._id!.toString();
                    return <div key={matchId} className="rounded-lg p-3 space-y-3 bg-secondary">
                        <div className="flex items-center justify-between text-xs">
                            <span>{match.group} - {match.sede}</span>
                            <span>{new Date(match.datetime).toLocaleString()}</span>
                        </div>
                        <form
                            action="/api/close"
                            method="POST"
                            className="grid grid-cols-5 gap-2 items-center text-center">
                            <input type="hidden" name="matchId" value={matchId} />
                            <div className="flex flex-col items-center">
                                <Image
                                    src={match.home.flagUrl}
                                    alt={match.home.name}
                                    width={52}
                                    height={36}
                                />
                                <span className="text-xs font-semibold mt-1">
                                    {match.home.name}
                                </span>
                            </div>
                            {/* Input / valor A */}
                            <div>
                                <Input
                                    required
                                    min={0}
                                    name="homeScore"
                                    type="number"
                                    defaultValue={match.result?.home ?? ""}
                                    className="w-12 sm:w-20 text-center bg-card"
                                />
                            </div>

                            {/* Vote / bloqueado */}
                            <Button type="submit" size="sm" className="px-5">
                                Cerrar
                            </Button>

                            {/* Input / valor B */}
                            <div>
                                <Input
                                    required
                                    min={0}
                                    name="awayScore"
                                    type="number"
                                    defaultValue={match.result?.away ?? ""}
                                    className="w-12 sm:w-20 text-center bg-card"
                                />
                            </div>

                            {/* Flag B + name below on mobile */}
                            <div className="flex flex-col items-center">
                                <Image
                                    src={match.away.flagUrl}
                                    alt={match.away.name}
                                    width={52}
                                    height={36}
                                />
                                <span className="text-xs font-semibold mt-1">
                                    {match.away.name}
                                </span>
                            </div>
                        </form>
                        {match.result && <form action="/api/close">
                            <input type="hidden" name="matchId" value={matchId} />
                            <button type="submit">Abrir partido</button>
                        </form>}
                    </div>
                })}
            </div>
        </div>
    );
}