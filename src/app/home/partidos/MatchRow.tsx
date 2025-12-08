"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { MatchRowProps } from "@/lib/types";

export default function MatchRow({
  match,
  session,
  existingPrediction,
  onVote,
}: MatchRowProps) {
  const isLocked = match.status === "finished" || match.result !== null;

  const handleVote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked || !onVote) return;

    const formData = new FormData(e.currentTarget);
    const homeScore = Number(formData.get(`home-${match.id}`));
    const awayScore = Number(formData.get(`away-${match.id}`));

    if (isNaN(homeScore) || isNaN(awayScore)) {
      alert("Ingresa marcadores válidos");
      return;
    }

    onVote(match.id, homeScore, awayScore);
  };

  const displayHomeScore =
    existingPrediction?.homeScore ??
    match.result?.homeScore ??
    "-";

  const displayAwayScore =
    existingPrediction?.awayScore ??
    match.result?.awayScore ??
    "-";

  return (
    <div className="border rounded-lg p-4 bg-card shadow-sm space-y-4">

      {/* Header */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{match.venue}</span>

        {isLocked ? (
          <span className="font-bold text-green-600">
            Final {match.result?.homeScore} - {match.result?.awayScore}
          </span>
        ) : (
          <span>{match.date} : {match.time}</span>
        )}
      </div>

      <form
        onSubmit={handleVote}
        className="grid grid-cols-5 sm:grid-cols-7 gap-2 items-center text-center"
      >

        {/* Flag A + name below on mobile */}
        <div className="flex flex-col items-center">
          <Image
            src={match.home.flagUrl}
            alt={match.home.name}
            width={52}
            height={36}
          />
          <span className="text-xs font-semibold mt-1 md:hidden">
            {match.home.name}
          </span>
        </div>

        {/* Name A (desktop only) */}
        <div className="text-sm font-semibold truncate hidden md:block">
          {match.home.name}
        </div>

        {/* Input / valor A */}
        <div>
          {session && !isLocked ? (
            <Input
              name={`home-${match.id}`}
              type="number"
              defaultValue={existingPrediction?.homeScore ?? ""}
              className="w-20 text-center"
            />
          ) : (
            <span className="font-bold text-lg">{displayHomeScore}</span>
          )}
        </div>

        {/* Vote / bloqueado */}
        <div className="flex justify-center">
          {session && !isLocked ? (
            <Button type="submit" size="sm" className="px-5">
              Votar
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Partido cerrado
            </span>
          )}
        </div>

        {/* Input / valor B */}
        <div>
          {session && !isLocked ? (
            <Input
              name={`away-${match.id}`}
              type="number"
              defaultValue={existingPrediction?.awayScore ?? ""}
              className="w-20 text-center"
            />
          ) : (
            <span className="font-bold text-lg">{displayAwayScore}</span>
          )}
        </div>

        {/* Name B (desktop only) */}
        <div className="text-sm font-semibold truncate hidden md:block">
          {match.away.name}
        </div>

        {/* Flag B + name below on mobile */}
        <div className="flex flex-col items-center">
          <Image
            src={match.away.flagUrl}
            alt={match.away.name}
            width={52}
            height={36}
          />
          <span className="text-xs font-semibold mt-1 md:hidden">
            {match.away.name}
          </span>
        </div>
      </form>
    </div>
  );
}
