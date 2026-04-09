import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  action: "create" | "update" | "delete" | "upload";
  entityType: string;
  entityId: string;
  entityName?: string;
  description: string;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    action: { type: String, enum: ["create", "update", "delete", "upload"], required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    entityName: { type: String },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
