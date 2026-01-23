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
  const grouped = matches.reduce((acc: any, match: any) => {

    const groupKey = match.group

    if (!acc[groupKey]) {
      groups.push(match.group);
      acc[groupKey] = {
        group: groupKey + ": " + match.sede,
        matches: []
      };
    }

    acc[groupKey].matches.push({
      id: match._id.toString(),
      group: match.group,
      ...match,
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
