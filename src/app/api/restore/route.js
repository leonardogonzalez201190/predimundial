import { NextResponse } from "next/server";
import Match from "@/models/Match";
import { connectToDB } from "@/lib/database";


const matchesToAdd = [
    // Grupo A - San Juan, Puerto Rico
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-06T18:00:00.000Z"),
      status: "scheduled",
      home: { name: "Puerto Rico", code: "PUR", flagUrl: "https://flagcdn.com/pr.svg" },
      away: { name: "Colombia", code: "COL", flagUrl: "https://flagcdn.com/co.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-07T12:00:00.000Z"),
      status: "scheduled",
      home: { name: "Colombia", code: "COL", flagUrl: "https://flagcdn.com/co.svg" },
      away: { name: "Canadá", code: "CAN", flagUrl: "https://flagcdn.com/ca.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-07T18:00:00.000Z"),
      status: "scheduled",
      home: { name: "Panamá", code: "PAN", flagUrl: "https://flagcdn.com/pa.svg" },
      away: { name: "Puerto Rico", code: "PUR", flagUrl: "https://flagcdn.com/pr.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-08T12:00:00.000Z"),
      status: "scheduled",
      home: { name: "Colombia", code: "COL", flagUrl: "https://flagcdn.com/co.svg" },
      away: { name: "Cuba", code: "CUB", flagUrl: "https://flagcdn.com/cu.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-08T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "Panamá", code: "PAN", flagUrl: "https://flagcdn.com/pa.svg" },
      away: { name: "Canadá", code: "CAN", flagUrl: "https://flagcdn.com/ca.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo A",
      sede: "San Juan, Puerto Rico",
      datetime: new Date("2026-03-09T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "Cuba", code: "CUB", flagUrl: "https://flagcdn.com/cu.svg" },
      away: { name: "Puerto Rico", code: "PUR", flagUrl: "https://flagcdn.com/pr.svg" },
      result: null,
    },
  
    // Grupo B - Houston, Texas, USA
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-06T20:00:00.000Z"),
      status: "scheduled",
      home: { name: "Estados Unidos", code: "USA", flagUrl: "https://flagcdn.com/us.svg" },
      away: { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/br.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-07T13:00:00.000Z"),
      status: "scheduled",
      home: { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/br.svg" },
      away: { name: "Italia", code: "ITA", flagUrl: "https://flagcdn.com/it.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-07T20:00:00.000Z"),
      status: "scheduled",
      home: { name: "Reino Unido", code: "GBR", flagUrl: "https://flagcdn.com/gb.svg" },
      away: { name: "Estados Unidos", code: "USA", flagUrl: "https://flagcdn.com/us.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-08T15:00:00.000Z"),
      status: "scheduled",
      home: { name: "Reino Unido", code: "GBR", flagUrl: "https://flagcdn.com/gb.svg" },
      away: { name: "Italia", code: "ITA", flagUrl: "https://flagcdn.com/it.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-08T20:00:00.000Z"),
      status: "scheduled",
      home: { name: "Brasil", code: "BRA", flagUrl: "https://flagcdn.com/br.svg" },
      away: { name: "México", code: "MEX", flagUrl: "https://flagcdn.com/mx.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-09T20:00:00.000Z"),
      status: "scheduled",
      home: { name: "México", code: "MEX", flagUrl: "https://flagcdn.com/mx.svg" },
      away: { name: "Estados Unidos", code: "USA", flagUrl: "https://flagcdn.com/us.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo B",
      sede: "Houston, Texas, USA",
      datetime: new Date("2026-03-11T18:00:00.000Z"),
      status: "scheduled",
      home: { name: "Italia", code: "ITA", flagUrl: "https://flagcdn.com/it.svg" },
      away: { name: "México", code: "MEX", flagUrl: "https://flagcdn.com/mx.svg" },
      result: null,
    },
  
    // Grupo C - Tokio, Japón
    {
      event: 1,
      group: "Grupo C",
      sede: "Tokio, Japón",
      datetime: new Date("2026-03-06T22:00:00.000Z"),
      status: "scheduled",
      home: { name: "China Taipei", code: "TPE", flagUrl: "https://flagcdn.com/tw.svg" },
      away: { name: "República Checa", code: "CZE", flagUrl: "https://flagcdn.com/cz.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo C",
      sede: "Tokio, Japón",
      datetime: new Date("2026-03-07T05:00:00.000Z"),
      status: "scheduled",
      home: { name: "Corea del Sur", code: "KOR", flagUrl: "https://flagcdn.com/kr.svg" },
      away: { name: "Japón", code: "JPN", flagUrl: "https://flagcdn.com/jp.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo C",
      sede: "Tokio, Japón",
      datetime: new Date("2026-03-08T06:00:00.000Z"),
      status: "scheduled",
      home: { name: "Australia", code: "AUS", flagUrl: "https://flagcdn.com/au.svg" },
      away: { name: "Japón", code: "JPN", flagUrl: "https://flagcdn.com/jp.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo C",
      sede: "Tokio, Japón",
      datetime: new Date("2026-03-09T06:00:00.000Z"),
      status: "scheduled",
      home: { name: "Corea del Sur", code: "KOR", flagUrl: "https://flagcdn.com/kr.svg" },
      away: { name: "Australia", code: "AUS", flagUrl: "https://flagcdn.com/au.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo C",
      sede: "Tokio, Japón",
      datetime: new Date("2026-03-10T06:00:00.000Z"),
      status: "scheduled",
      home: { name: "República Checa", code: "CZE", flagUrl: "https://flagcdn.com/cz.svg" },
      away: { name: "Japón", code: "JPN", flagUrl: "https://flagcdn.com/jp.svg" },
      result: null,
    },
  
    // Grupo D - Miami, Florida, USA
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-06T12:00:00.000Z"),
      status: "scheduled",
      home: { name: "Países Bajos", code: "NED", flagUrl: "https://flagcdn.com/nl.svg" },
      away: { name: "Venezuela", code: "VEN", flagUrl: "https://flagcdn.com/ve.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-06T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "Nicaragua", code: "NCA", flagUrl: "https://flagcdn.com/ni.svg" },
      away: { name: "República Dominicana", code: "DOM", flagUrl: "https://flagcdn.com/do.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-07T12:00:00.000Z"),
      status: "scheduled",
      home: { name: "Nicaragua", code: "NCA", flagUrl: "https://flagcdn.com/ni.svg" },
      away: { name: "Países Bajos", code: "NED", flagUrl: "https://flagcdn.com/nl.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-07T18:00:00.000Z"),
      status: "scheduled",
      home: { name: "Israel", code: "ISR", flagUrl: "https://flagcdn.com/il.svg" },
      away: { name: "Venezuela", code: "VEN", flagUrl: "https://flagcdn.com/ve.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-08T12:00:00.000Z"),
      status: "scheduled",
      home: { name: "Nicaragua", code: "NCA", flagUrl: "https://flagcdn.com/ni.svg" },
      away: { name: "Israel", code: "ISR", flagUrl: "https://flagcdn.com/il.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-09T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "República Dominicana", code: "DOM", flagUrl: "https://flagcdn.com/do.svg" },
      away: { name: "Israel", code: "ISR", flagUrl: "https://flagcdn.com/il.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-09T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "Venezuela", code: "VEN", flagUrl: "https://flagcdn.com/ve.svg" },
      away: { name: "Nicaragua", code: "NCA", flagUrl: "https://flagcdn.com/ni.svg" },
      result: null,
    },
    {
      event: 1,
      group: "Grupo D",
      sede: "Miami, Florida, USA",
      datetime: new Date("2026-03-10T19:00:00.000Z"),
      status: "scheduled",
      home: { name: "Israel", code: "ISR", flagUrl: "https://flagcdn.com/il.svg" },
      away: { name: "Países Bajos", code: "NED", flagUrl: "https://flagcdn.com/nl.svg" },
      result: null,
    },
  ];
  

export async function GET(request) {
    try {

        await connectToDB();
        
        // await Match.deleteMany({ event: 1 });

        // const createdMatches = await Match.insertMany(matchesToAdd);      

        return NextResponse.json(
            { ok: true, data: matchesToAdd },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { ok: false, error: "Error al guardar múltiples grupos" },
            { status: 500 }
        );
    }
}