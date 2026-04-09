export type CandidateLifecycleStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Converted";

export type BundleStatus = CandidateLifecycleStatus;
export type CandidateStatus = CandidateLifecycleStatus;

export interface BundleCandidate {
  leadId: string;
  fullName: string;
  email: string;
  cvUrl: string;
  department?: string;
  role?: string;
  status: CandidateStatus;
  statusUpdatedAt?: string | Date;
}

export interface CvBundle {
  _id: string;
  bundleName: string;
  companyName: string;
  companyEmail?: string;
  sentAt?: string | Date;
  status: BundleStatus;
  candidates: BundleCandidate[];
  invoiceUrl?: string;
  invoiceUploadedAt?: string | Date;
  notes?: string;
  createdBy: string;
  deletedAt?: string | Date;
  deletedBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

