"use client"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
    awayName
 }: { matchId: string, homeName: string, awayName: string }) {
  const [predictions, setPredictions] = useState<PredictionItem[]>([])
  const [loading, setLoading] = useState(false)

  async function handleOpenChange(open: boolean) {
    if (!open) return

    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/predictions?matchId=${matchId}`,
        { cache: "no-store" }
      )

      // tu API devuelve un array directo, no { predictions: [] }
      const data: PredictionItem[] = await response.json()
      setPredictions(data)
    } catch (error) {
      console.error("Error fetching predictions:", error)
      setPredictions([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Collapsible onOpenChange={(open) => handleOpenChange(open)}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="group w-full">
          <List />
          Predicciones
          <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col py-3">
        <table className="w-full text-left text-[12px] bg-card">
          <thead>
            <tr className="border text-card-foreground bg-secondary">
              <th className="p-1 text-center">{homeName}</th>
              <th className="p-1 text-center">Nombre</th>
              <th className="p-1 text-center">{awayName}</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr className="border-b">
                <td className="p-2 text-center" colSpan={3}>
                  Cargando predicciones...
                </td>
              </tr>
            )}

            {!loading && _.isEmpty(predictions) && (
              <tr className="border-b">
                <td className="p-2 text-center" colSpan={3}>
                  No hay predicciones aún
                </td>
              </tr>
            )}

            {!loading &&
              predictions.map((prediction) => (
                <tr key={prediction.id} className="border-b">
                  <td className="p-1 text-center">{prediction.homeScore}</td>
                  <td className="p-1 text-center">
                    {prediction.alias ?? prediction.username}
                  </td>
                  <td className="p-1 text-center">{prediction.awayScore}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </CollapsibleContent>
    </Collapsible>
  )
}
