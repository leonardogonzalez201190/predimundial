import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema(
    {
        name: { type: String, required: true },
        code: { type: String, required: true },
        flagUrl: { type: String, required: true },
    },
    { _id: false }
);

const Team = models?.Team || model("Team", TeamSchema);

export default Team;

