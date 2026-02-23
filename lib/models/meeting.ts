import mongoose, { Schema, Document } from "mongoose";

export interface IMeeting extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  attendees: string[]; // Array of emails
  status: "scheduled" | "completed" | "cancelled";
  relatedTo?: mongoose.Types.ObjectId; // Optional link to application/lead
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    location: { type: String },
    meetingLink: { type: String },
    attendees: [{ type: String }],
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    relatedTo: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model<IMeeting>("Meeting", MeetingSchema);
