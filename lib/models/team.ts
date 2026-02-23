import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
  isActive: boolean;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
