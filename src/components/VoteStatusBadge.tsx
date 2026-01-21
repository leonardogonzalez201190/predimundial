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
  if (existingPrediction) {
    return (
      <span className="text-xs font-semibold text-green-700 flex items-center gap-2 bg-green-100 rounded w-min whitespace-nowrap p-1 px-2">
        <Check className="size-4" />
        {votedText}
      </span>
    )
  }

  return (
    <span className="text-xs font-semibold text-red-700 flex items-center gap-2 bg-red-100 rounded w-min whitespace-nowrap p-1 px-2">
      <AlertTriangle className="size-4" />
      {notVotedText}
    </span>
  )
}
