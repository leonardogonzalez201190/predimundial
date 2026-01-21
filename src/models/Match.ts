// models/Match.ts
import { Schema, model, models } from "mongoose";

const TeamMiniSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    flagUrl: { type: String, required: true },
  },
  { _id: false }
);

export const MatchSchema = new Schema(
  {
    event: { type: Number, required: true, default: 1 },

    group: { type: String, required: true }, // Ej: "Grupo A"
    sede: { type: String, required: true },  // Ej: "San Juan, Puerto Rico"

    datetime: { type: Date, required: true },

    status: {
      type: String,
      enum: ["scheduled", "finished", "live", "cancelled"],
      default: "scheduled",
      required: true,
    },

    home: { type: TeamMiniSchema, required: true },
    away: { type: TeamMiniSchema, required: true },

    result: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const Match = models?.Match || model("Match", MatchSchema);

export default Match;
