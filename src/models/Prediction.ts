import { Schema, model, models } from "mongoose";

const PredictionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchId: {
      type: String,
      required: true,
    },
    homeScore: {
      type: Number,
      required: true,
    },
    awayScore: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 clave para evitar duplicados por usuario + partido
PredictionSchema.index({ userId: 1, matchId: 1 }, { unique: true });

const Prediction =
  models?.Prediction || model("Prediction", PredictionSchema);

export default Prediction;
