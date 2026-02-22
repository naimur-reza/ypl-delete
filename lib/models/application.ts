import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter: string;
  career: mongoose.Types.ObjectId;
  branch: mongoose.Types.ObjectId;
  status: string;
  appliedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    career: { type: Schema.Types.ObjectId, ref: "Career", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    status: {
      type: String,
      enum: ["new", "reviewed", "shortlisted", "rejected", "hired"],
      default: "new",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
