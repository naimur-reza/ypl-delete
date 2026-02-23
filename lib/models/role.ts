import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  slug: string;
  departmentId: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    departmentId: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Ensure name is unique within a department
RoleSchema.index({ name: 1, departmentId: 1 }, { unique: true });

export default mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);
