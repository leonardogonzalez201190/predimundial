import { Schema, model, models } from "mongoose";
import Team from "./Team";

const MatchSchema = new Schema(
    {
        id: { type: String, required: true }, // Ej: "A1"
        group: { type: String, required: true }, // Ej: "A"
        date: { type: String, required: true }, // Ej: "2026-06-11"
        time: { type: String, required: true }, // Ej: "18:00"
        venue: { type: String, required: true }, // Ej: "Ciudad de México, México"
        status: {
            type: String,
            enum: ["scheduled", "finished", "live", "cancelled"],
            default: "scheduled",
            required: true,
        },
        result: { type: Schema.Types.Mixed, default: null }, // puede ser null o un objeto
        home: { type: Team, required: true },
        away: { type: Team, required: true },
    },
    { _id: false }
);

const Match = models?.Match || model("Match", MatchSchema);

export default Match;
