import { NextResponse } from "next/server";

// Mock de ejemplo (hipotético) para el Mundial 2026
const data = {
  groups: [
    {
      group: "A",
      matches: [
        {
          "id": "A1",
          "date": "2026-06-11",
          "time": "19:00",
          "venue": "Los Angeles, CA",
          "status": "scheduled",
          "result": null,
          "home": { "name": "USA", "code": "US", "flagUrl": "https://flagcdn.com/us.svg" },
          "away": { "name": "Wales", "code": "GB-WLS", "flagUrl": "https://flagcdn.com/gb-wls.svg" }
        },
        {
          id: "A2",
          date: "2024-06-12",
          time: "16:00",
          venue: "Mexico City, MX",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "Mexico", code: "MX", flagUrl: "https://flagcdn.com/mx.svg" },
          away: { name: "Poland", code: "PL", flagUrl: "https://flagcdn.com/pl.svg" }
        }
      ]
    },
    {
      group: "B",
      matches: [
        {
          id: "B1",
          date: "2026-06-11",
          time: "22:00",
          venue: "Toronto, ON",
          status: "scheduled",
          result: null,
          home: { name: "England", code: "GB-ENG", flagUrl: "https://flagcdn.com/gb-eng.svg" },
          away: { name: "Senegal", code: "SN", flagUrl: "https://flagcdn.com/sn.svg" }
        },
        {
          id: "B2",
          date: "2024-06-13",
          time: "18:00",
          venue: "Edmonton, AB",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "USA", code: "US", flagUrl: "https://flagcdn.com/us.svg" },
          away: { name: "Senegal", code: "SN", flagUrl: "https://flagcdn.com/sn.svg" }
        }
      ]
    },
    {
      group: "C",
      matches: [
        {
          id: "C1",
          date: "2024-06-13",
          time: "18:00",
          venue: "New York/New Jersey, NY",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "Brazil", code: "BR", flagUrl: "https://flagcdn.com/br.svg" },
          away: { name: "Morocco", code: "MA", flagUrl: "https://flagcdn.com/ma.svg" }
        },
        {
          id: "C2",
          date: "2024-06-13",
          time: "21:00",
          venue: "Boston, MA",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "Haiti", code: "HT", flagUrl: "https://flagcdn.com/ht.svg" },
          away: { name: "Scotland", code: "GB-SCT", flagUrl: "https://flagcdn.com/gb-sct.svg" }
        },
        {
          id: "C3",
          date: "2024-06-17",
          time: "20:00",
          venue: "Philadelphia, PA",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "Morocco", code: "MA", flagUrl: "https://flagcdn.com/ma.svg" },
          away: { name: "Haiti", code: "HT", flagUrl: "https://flagcdn.com/ht.svg" }
        },
        {
          id: "C4",
          date: "2024-06-17",
          time: "23:00",
          venue: "Atlanta, GA",
          status: "finished",
          result: { "home": 2, "away": 1 },
          home: { name: "Brazil", code: "BR", flagUrl: "https://flagcdn.com/br.svg" },
          away: { name: "Scotland", code: "GB-SCT", flagUrl: "https://flagcdn.com/gb-sct.svg" }
        }
      ]
    }
    // ... puedes añadir más grupos y partidos como quieras ...
  ]
};

export async function GET() {
  return NextResponse.json(data);
}
