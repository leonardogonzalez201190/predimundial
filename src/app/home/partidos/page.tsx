import Prediction from "@/models/Prediction";
import { connectToDB } from "@/lib/database";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import MatchesList from "./MatchesList";
import NewMatchForm from "./NewMatchForm";

export default async function MatchesPage() {
  const session = await getServerSession(authConfig);

  const matchesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/matches`, {
    cache: "no-store"
  });

  const matchesData = await matchesRes.json();

  let predictions = [];

  if (session) {
    await connectToDB();
    predictions = JSON.parse(JSON.stringify(
      await Prediction.find({ userId: session.user.id }).lean()
    ));
  }

  return (
    <div className="p-4 space-y-4">
      <NewMatchForm />
      <MatchesList
        data={matchesData}
        session={session}
        predictions={predictions} // ← ahora es JSON válido
      />
    </div>
  );
}
