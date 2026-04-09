export interface CandidateLead {
  _id?: string;
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
  createdAt: string;
  submittedAt?: string;
  lastNotifiedAt?: string;
}
