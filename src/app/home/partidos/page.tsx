// app/(whatever)/matches/page.tsx
import Prediction from "@/models/Prediction";
import Match from "@/models/Match";
import { connectToDB } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import MatchesList from "./MatchesList";
import { serialize } from "@/lib/utils";

export default async function MatchesPage({ searchParams }: { searchParams: { group?: string } }) {
  const _searchParams = await searchParams;
  const session = await getServerSession(authConfig);

  await connectToDB();

  let predictions: any[] = [];
  const query: any = {
    event: session?.user?.event,
  };

  if (_searchParams.group) {
    query.group = _searchParams.group;
  }

  // Traer todos los partidos desde MongoDB
  const matches = await Match.find(query).lean();

  if (session) predictions = await Prediction.find({ userId: session.user.id }).lean();

  const groups: string[] = [];

  // Agrupar por grupo y dar el formato que quieres
  const grouped = matches.reduce((acc: any, match: any, index: number) => {

    const groupKey = match.group?.replace("Grupo ", "").trim(); // "Grupo A" -> "A"

    if (!acc[groupKey]) {
      groups.push(match.group);
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

  return (
    <div className="px-4 sm:px-0 space-y-4">
      <MatchesList
        predictions={serialize(predictions)}
        data={serialize(matchesData)}
        session={session}
      />
    </div>
  );
}
