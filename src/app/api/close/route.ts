import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import Match from "@/models/Match";

export async function GET(request: Request) {
    try {
        await connectToDB();
        const url = new URL(request.url);
        const matchId = url.searchParams.get("matchId");

        await Match.updateOne(
            { _id: matchId },
            { $set: { result: null } }
        );

        return NextResponse.redirect(new URL("/admin", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL("/admin", request.url));
    }
}


export async function POST(request: Request) {
    try {
        await connectToDB();
        const formData = await request.formData();

        const matchId = formData.get("matchId");       
        const homeScore = formData.get("homeScore"); 
        const awayScore = formData.get("awayScore");

        await Match.updateOne(
            { _id: matchId },
            { $set: { result: { home: homeScore, away: awayScore } } }
        );

        return NextResponse.redirect(new URL("/admin", request.url));
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL("/admin", request.url));
    }
}
