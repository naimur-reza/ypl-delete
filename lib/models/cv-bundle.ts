import mongoose, { Schema, Document } from "mongoose";

export type BundleStatus = "New" | "Contacted" | "Qualified" | "Converted";
export type CandidateStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted";

export interface IBundleCandidate {
  leadId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  cvUrl: string;
  department?: string;
  role?: string;
  status: CandidateStatus;
  statusUpdatedAt?: Date;
}

export interface ICvBundle extends Document {
  bundleName: string;
  companyName: string;
  companyEmail?: string;
  sentAt?: Date;
  status: BundleStatus;
  candidates: IBundleCandidate[];
  invoiceUrl?: string;
  invoiceUploadedAt?: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
}

const BundleCandidateSchema = new Schema<IBundleCandidate>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "SalaryGuideLead", required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    cvUrl: { type: String, default: "" },
    department: { type: String, default: "" },
    role: { type: String, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted"],
      default: "New",
    },
    statusUpdatedAt: { type: Date },
  },
  { _id: false }
);

const CvBundleSchema = new Schema<ICvBundle>(
  {
    bundleName: { type: String, required: true },
    companyName: { type: String, required: true },
    companyEmail: { type: String, default: "" },
    sentAt: { type: Date },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Converted"],
      default: "New",
    },
    candidates: { type: [BundleCandidateSchema], default: [] },
    invoiceUrl: { type: String, default: "" },
    invoiceUploadedAt: { type: Date },
    notes: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

CvBundleSchema.index({ status: 1, createdAt: -1 });
CvBundleSchema.index({ companyName: 1 });

const existingModel = mongoose.models.CvBundle as mongoose.Model<ICvBundle> | undefined;
if (existingModel) {
  const bundleEnumValues =
    ((existingModel.schema.path("status") as any)?.enumValues as string[] | undefined) || [];
  const candidateEnumValues =
    (((existingModel.schema.path("candidates") as any)?.schema?.path("status") as any)
      ?.enumValues as string[] | undefined) || [];

  const enumMismatch =
    !bundleEnumValues.includes("Converted") ||
    !candidateEnumValues.includes("Converted");

  // Guard against stale hot-reload model schema in long-running dev processes.
  if (enumMismatch) {
    delete mongoose.models.CvBundle;
  }
}

export default (mongoose.models.CvBundle as mongoose.Model<ICvBundle>) ||
  mongoose.model<ICvBundle>("CvBundle", CvBundleSchema);

