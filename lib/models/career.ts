import mongoose, { Schema, Document } from "mongoose";

export interface ICareer extends Document {
  title: string;
  slug: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary: string;
  category: string;
  department: string;
  branch: mongoose.Types.ObjectId;
  postedDate: Date;
  isActive: boolean;
}

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    company: { type: String, default: "" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    location: { type: String, required: true },
    type: { type: String, default: "Full-time" },
    salary: { type: String, default: "" },
    category: { type: String, default: "" },
    department: { type: String, default: "" },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    postedDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Career || mongoose.model<ICareer>("Career", CareerSchema);
