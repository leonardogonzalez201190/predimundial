"use server";

import { connectToDB } from "@/lib/database";
import Match from "@/models/Match";


export async function fetchGroups() {
    try {
        await connectToDB();
        const groups = await Match.find().distinct("group");
        return groups;
    } catch (error) {
        console.error(error);
        return [];
    }
}