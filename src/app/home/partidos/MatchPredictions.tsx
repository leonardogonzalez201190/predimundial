"use client"

import _ from "lodash"
import { ChevronDownIcon, List } from "lucide-react"
import { useState } from "react"

type PredictionItem = {
  id: string
  username: string
  alias: string
  homeScore: number
  awayScore: number
}

export default function MatchPredictions({
  matchId,
  homeName,
  awayName,
}: {
  matchId: string
  homeName: string
  awayName: string
}) {
  const [predictions, setPredictions] = useState<PredictionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadedOnce, setLoadedOnce] = useState(false)

  async function handleToggle(open: boolean) {
    if (!open) return
    if (loadedOnce) return

    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/predictions?matchId=${matchId}`,
        { cache: "no-store" }
      )

      const data: PredictionItem[] = await response.json()
      setPredictions(data)
      setLoadedOnce(true)
    } catch (error) {
      console.error("Error fetching predictions:", error)
      setPredictions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <details
      className="group w-full rounded-md border border-input bg-background text-xs"
      onToggle={(e) =>
        handleToggle((e.currentTarget as HTMLDetailsElement).open)
      }
    >
      <summary
        className="px-3 py-2
          list-none cursor-pointer select-none
          inline-flex w-full items-center gap-2
        "
      >
        <List className="h-4 w-4" />
        Predicciones
        <ChevronDownIcon className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>

      <div className="flex flex-col">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="text-card-foreground">
              <th className="p-1 text-center">{homeName}</th>
              <th className="p-1 text-center">Nombre</th>
              <th className="p-1 text-center">{awayName}</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr className="">
                <td className="p-2 text-center" colSpan={3}>
                  Cargando predicciones...
                </td>
              </tr>
            )}

            {!loading && _.isEmpty(predictions) && (
              <tr className="">
                <td className="p-2 text-center" colSpan={3}>
                  No hay predicciones aún
                </td>
              </tr>
            )}

            {!loading &&
              predictions.map((prediction) => (
                <tr key={prediction.id} className="border-t">
                  <td className="p-1 text-center">{prediction.homeScore}</td>
                  <td className="p-1 text-center">
                    {prediction.alias ?? prediction.username}
                  </td>
                  <td className="p-1 text-center">{prediction.awayScore}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
