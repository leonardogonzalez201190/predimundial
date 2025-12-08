"use client";

import MatchRow from "./MatchRow";
import { Group, Match, MatchesProps, Prediction } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MatchesList({ data, session, predictions }: MatchesProps) {

  const router = useRouter();

  async function handleVote(matchId: string, home: number, away: number) {
    if (!session) return alert("Debes iniciar sesión para guardar una predicción");

    try {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ matchId, homeScore: home, awayScore: away })
      });

      if (!res.ok) {
        const json = await res.json();
        toast(json.error || "Error guardando predicción");
      } else {
        toast("Predicción guardada");
        router.refresh();
      }
    } catch (error) {
      toast("Error de red");
      console.error(error);
    }
  }

  return (
    <div className="space-y-12">

      {data.groups.map((group: Group) => (
        <div key={group.group}>
          <h2 className="font-bold mb-4 text-primary">
            Grupo {group.group}
          </h2>

          <div className="space-y-4">
            {group.matches.map((match: Match) => {
              const existing = predictions.find(
                (p: Prediction) => p.matchId === match.id
              );

              return (
                <MatchRow
                  key={match.id}
                  match={match}
                  session={session}
                  existingPrediction={existing}
                  onVote={handleVote}
                />
              );
            })}
          </div>
        </div>
      ))}

    </div>
  );
}
