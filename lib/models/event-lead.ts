import mongoose, { Schema, Document } from "mongoose";

export interface IEventLead extends Document {
  eventId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  mobileNumber: string;
  organization?: string;
  designation?: string;
  status: "pending" | "confirmed" | "cancelled";
  submittedAt: Date;
}

const EventLeadSchema = new Schema<IEventLead>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    organization: { type: String },
    designation: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.EventLead || mongoose.model<IEventLead>("EventLead", EventLeadSchema);
