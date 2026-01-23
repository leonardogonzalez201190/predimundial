import Match from "@/models/Match";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";

export async function GET() {
  try {
    await connectToDB();
    await Match.updateMany(
      {},
      [
        {
          $set: {
            result: null,
            // result: {
            //   home: { $floor: { $multiply: [{ $rand: {} }, 11] } },
            //   away: { $floor: { $multiply: [{ $rand: {} }, 11] } },
            // },
          },
        },
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error listando predicciones" }, { status: 500 });
  }
}
