import { connectToDB } from "@/lib/database";
import Prediction from "@/models/Prediction";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await connectToDB();

  const session = await getServerSession(authConfig);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const body = await request.json();
  const { matchId, homeScore, awayScore } = body;

  if (!matchId || homeScore === undefined || awayScore === undefined) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  try {
    // 🔥 upsert — insert si no existe o update si existe
    const prediction = await Prediction.findOneAndUpdate(
      { userId, matchId },
      { homeScore, awayScore },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, prediction }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
