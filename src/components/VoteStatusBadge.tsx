"use client"

import { AlertTriangle, Check } from "lucide-react"

type VoteStatusBadgeProps = {
  existingPrediction: boolean
  votedText?: string
  notVotedText?: string
}

export default function VoteStatusBadge({
  existingPrediction,
  votedText = "Ya votaste",
  notVotedText = "No has votado",
}: VoteStatusBadgeProps) {
  return <div className="flex justify-end">
    {existingPrediction ? (
      <span className="text-xs font-semibold flex items-center gap-2 rounded w-min whitespace-nowrap p-1 px-2 bg-primary/5">
        <Check className="size-4" />
        {votedText}
      </span>
    ) : (
      <span className="text-xs font-semibold text-red-700 flex items-center gap-2 bg-red-100 rounded w-min whitespace-nowrap p-1 px-2">
        <AlertTriangle className="size-4" />
        {notVotedText}
      </span>
    )}
  </div>
}
