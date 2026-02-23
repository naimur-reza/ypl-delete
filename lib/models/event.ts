import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: "webinar" | "workshop" | "meetup" | "other";
  isActive: boolean;
  createdBy: string;
  imageUrl?: string;
  capacity?: number;
  registrationLink?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["webinar", "workshop", "meetup", "other"],
      required: true,
      default: "other",
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    imageUrl: { type: String },
    capacity: { type: Number },
    registrationLink: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
