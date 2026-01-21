// app/(whatever)/matches/page.tsx
import Prediction from "@/models/Prediction";
import Match from "@/models/Match";
import { connectToDB } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import MatchesList from "./MatchesList";

export default async function MatchesPage() {
  const session: any = await getServerSession(authConfig);

  await connectToDB();

  // Traer todos los partidos desde MongoDB
  const matches = JSON.parse(JSON.stringify(await Match.find({ event: session?.user?.event }).lean()));

  // Agrupar por grupo y dar el formato que quieres
  const grouped = matches.reduce((acc: any, match: any, index: number) => {
    const groupKey = match.group?.replace("Grupo ", "").trim(); // "Grupo A" -> "A"

    if (!acc[groupKey]) {
      acc[groupKey] = { group: groupKey, matches: [] };
    }

    acc[groupKey].matches.push({
      id: match._id.toString(),
      group: groupKey,
      date: new Date(match.datetime).toISOString().split("T")[0],
      time: new Date(match.datetime).toISOString().split("T")[1].slice(0, 5),
      venue: match.sede,
      status: match.status,
      result: match.result ?? null,
      home: match.home,
      away: match.away,
    });

    return acc;
  }, {});

  const matchesData = {
    groups: Object.values(grouped),
  };

  let predictions: any[] = [];

  if (session) {
    predictions = JSON.parse(
      JSON.stringify(await Prediction.find({ userId: session.user.id }).lean())
    );
  }

  return (
    <div className="px-4 space-y-4">
      <MatchesList data={matchesData} session={session} predictions={predictions} />
    </div>
  );
}
