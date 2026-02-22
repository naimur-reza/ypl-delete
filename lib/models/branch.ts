import mongoose, { Schema, Document } from "mongoose";

export interface IBranch extends Document {
  name: string;
  slug: string;
  location: string;
  contactEmail: string;
  isActive: boolean;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    contactEmail: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Branch || mongoose.model<IBranch>("Branch", BranchSchema);
