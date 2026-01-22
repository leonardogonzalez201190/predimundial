import Prediction from "@/models/Prediction";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const predictions = await Prediction.find({ matchId: { $type: "string" } }).lean();

    for (const p of predictions as any[]) {
      await Prediction.updateOne(
        { _id: p._id },
        { $set: { matchId: new mongoose.Types.ObjectId(p.matchId) } }
      );
    }

    return NextResponse.json({ ok: true, updated: predictions.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error migrando" }, { status: 500 });
  }
}
