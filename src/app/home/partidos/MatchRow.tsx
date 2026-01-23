"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { MatchRowProps } from "@/lib/types";
import MatchPredictions from "./MatchPredictions";
import VoteStatusBadge from "@/components/VoteStatusBadge";

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
    match.result?.home ??
    "-";

  const displayAwayScore =
    existingPrediction?.awayScore ??
    match.result?.away ??
    "-";

  return (
    <div className="rounded-lg p-3 space-y-3 bg-secondary">

      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <span>{match.venue}</span>

        {isLocked ? (
          <span className="font-bold ">
            Final {match.result?.home} - {match.result?.away}
          </span>
        ) : (
          <strong>{match.date} : {match.time}</strong>
        )}
      </div>

      <form
        onSubmit={handleVote}
        className="grid grid-cols-5 gap-2 items-center text-center"
      >

        {/* Flag A + name below on mobile */}
        <div className="flex flex-col items-center">
          <Image
            src={match.home.flagUrl}
            alt={match.home.name}
            width={52}
            height={36}
          />
          <strong className="text-xs font-semibold mt-1">
            {match.home.name}
          </strong>
        </div>


        {/* Input / valor A */}
        <div>
          {session && !isLocked ? (
            <Input
              min={0}
              name={`home-${match.id}`}
              type="number"
              defaultValue={existingPrediction?.homeScore ?? ""}
              className="w-12 sm:w-20 text-center bg-card"
            />
          ) : (
            <strong className="text-lg">{displayHomeScore}</strong>
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
              min={0}
              name={`away-${match.id}`}
              type="number"
              defaultValue={existingPrediction?.awayScore ?? ""}
              className="w-12 sm:w-20 text-center bg-card"
            />
          ) : (
            <strong className="text-lg">{displayAwayScore}</strong>
          )}
        </div>

        {/* Flag B + name below on mobile */}
        <div className="flex flex-col items-center">
          <Image
            src={match.away.flagUrl}
            alt={match.away.name}
            width={52}
            height={36}
          />
          <strong className="text-xs font-semibold mt-1">
            {match.away.name}
          </strong>
        </div>
      </form>
      {!isLocked && <VoteStatusBadge existingPrediction={!!existingPrediction} />}
      {isLocked && <MatchPredictions matchId={match.id} homeName={match.home.name} awayName={match.away.name} />}
    </div>
  );
}
