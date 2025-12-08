import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  alias: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,   // permite null sin romper unique
    trim: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const User = models?.User || model("User", UserSchema);

export default User;
