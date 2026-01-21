import { Schema, model, models } from "mongoose";
import Match from "./Match";

const GroupSchema = new Schema(
    {
        group: { type: String, required: true }, // Ej: "A"
        matches: { type: [Match], default: [] },
    },
    { timestamps: true }
);

const Group = models?.Group || model("Group", GroupSchema);

export default Group;
