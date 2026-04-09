import mongoose, { Schema, Document } from "mongoose";

export interface ISalaryGuideLead extends Document {
  fullName: string;
  email: string;
  mobileNumber: string;
  professionalQualification: string;
  educationalQualification: string;
  totalExperience: string;
  currentPosition: string;
  department: string;
  role: string;
  currentOrganization: string;
  previousOrganizations: string;
  industry: string;
  currentSalary: string;
  expectedSalary: string;
  availableFromDate: string;
  location: string;
  cvUrl: string;
  status: string;
  submittedAt: Date;
  lastNotifiedAt?: Date;
}

const SalaryGuideLeadSchema = new Schema<ISalaryGuideLead>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    professionalQualification: { type: String, default: "" },
    educationalQualification: { type: String, default: "" },
    totalExperience: { type: String, default: "" },
    currentPosition: { type: String, default: "" },
    department: { type: String, default: "" },
    role: { type: String, default: "" },
    currentOrganization: { type: String, default: "" },
    previousOrganizations: { type: String, default: "" },
    industry: { type: String, default: "" },
    currentSalary: { type: String, default: "" },
    expectedSalary: { type: String, default: "" },
    availableFromDate: { type: String, default: "" },
    location: { type: String, required: true },
    cvUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted"],
      default: "New",
    },
    submittedAt: { type: Date, default: Date.now },
    lastNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.SalaryGuideLead ||
  mongoose.model<ISalaryGuideLead>("SalaryGuideLead", SalaryGuideLeadSchema);
