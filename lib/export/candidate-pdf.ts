"use client";

import jsPDF from "jspdf";

export type CandidateExportItem = {
  _id?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  currentPosition?: string;
  department?: string;
  role?: string;
  currentOrganization?: string;
  previousOrganizations?: string;
  industry?: string;
  educationalQualification?: string;
  professionalQualification?: string;
  totalExperience?: string;
  currentSalary?: string;
  expectedSalary?: string;
  availableFromDate?: string;
  location?: string;
  cvUrl?: string;
  createdAt?: string;
  submittedAt?: string;
};

const BRAND = [249, 115, 22] as const;

const profileMissing = (c: CandidateExportItem) => {
  const missing: string[] = [];
  if (!c.role) missing.push("Role");
  if (!c.currentPosition) missing.push("Current Position");
  if (!c.professionalQualification) missing.push("Professional Qualification");
  if (!c.cvUrl) missing.push("CV");
  return missing;
};

const isExpired = (c: CandidateExportItem) => {
  const source = c.createdAt || c.submittedAt;
  if (!source) return false;
  const createdTime = new Date(source).getTime();
  if (Number.isNaN(createdTime)) return false;
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return createdTime < sixMonthsAgo.getTime();
};

const footer = (doc: jsPDF, exportDate: string) => {
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Exported: ${exportDate}`, 14, doc.internal.pageSize.getHeight() - 8);
    doc.text(
      `Page ${i} of ${pages}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" },
    );
  }
};

export function exportCandidateSummaryPdf(candidates: CandidateExportItem[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const exportDate = new Date().toLocaleString();

  doc.setFillColor(...BRAND);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 54, "F");
  doc.setTextColor(255);
  doc.setFontSize(15);
  doc.text("Candidate CV Bank", 14, 33);
  doc.setFontSize(10);
  doc.text("Summary Report", doc.internal.pageSize.getWidth() - 14, 33, { align: "right" });

  doc.setTextColor(20);
  doc.setFontSize(10);
  let y = 72;
  const rowHeight = 28;
  const pageHeight = doc.internal.pageSize.getHeight();
  candidates.forEach((c, idx) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 28;
    }
    const missing = profileMissing(c);
    const expired = isExpired(c);
    const registrationDate = c.createdAt || c.submittedAt || "—";
    doc.setDrawColor(230);
    doc.rect(14, y - 14, doc.internal.pageSize.getWidth() - 28, rowHeight);
    doc.text(
      `${idx + 1}. ${c.fullName || "—"} | ${c.email || "—"} | ${c.mobileNumber || "—"} | ${c.currentPosition || "—"} | ${c.department || "—"} | ${c.role || "—"} | ${c.currentOrganization || "—"} | ${c.previousOrganizations || "—"} | ${c.industry || "—"} | ${c.educationalQualification || "—"} | ${c.professionalQualification || "—"} | ${c.totalExperience || "—"} | Current: ${c.currentSalary || "—"} | Expected: ${c.expectedSalary || "—"} | ${c.availableFromDate || "—"} | ${c.location || "—"} | ${c.cvUrl || "CV Attached"} | Registered: ${registrationDate} | ${expired ? "CV Outdated" : "CV Current"} | ${missing.length ? `Incomplete: ${missing.join(", ")}` : "Profile Complete"}`,
      18,
      y + 2,
      { maxWidth: doc.internal.pageSize.getWidth() - 40 },
    );
    y += rowHeight + 6;
  });

  footer(doc, exportDate);
  doc.save(`candidate-cv-summary-${Date.now()}.pdf`);
}

export function exportCandidateProfileCardsPdf(candidates: CandidateExportItem[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const exportDate = new Date().toLocaleString();

  candidates.forEach((c, index) => {
    if (index > 0) doc.addPage();
    doc.setFillColor(...BRAND);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 54, "F");
    doc.setTextColor(255);
    doc.setFontSize(15);
    doc.text("Candidate CV Bank", 14, 33);

    doc.setTextColor(30);
    doc.setFontSize(14);
    doc.text(c.fullName || "Unnamed Candidate", 14, 80);
    doc.setFontSize(10);

    const rows: Array<[string, string]> = [
      ["Email", c.email || "—"],
      ["Mobile Number", c.mobileNumber || "—"],
      ["Current Position", c.currentPosition || "—"],
      ["Department", c.department || "—"],
      ["Role", c.role || "—"],
      ["Current Organization", c.currentOrganization || "—"],
      ["Previous Organizations", c.previousOrganizations || "—"],
      ["Industry", c.industry || "—"],
      ["Educational Qualification", c.educationalQualification || "—"],
      ["Professional Qualification", c.professionalQualification || "—"],
      ["Total Experience", c.totalExperience || "—"],
      ["Current Salary", c.currentSalary || "—"],
      ["Expected Salary", c.expectedSalary || "—"],
      ["Available From", c.availableFromDate || "—"],
      ["Location", c.location || "—"],
      ["CV Link", c.cvUrl || "No CV uploaded"],
      ["Registration Date", c.createdAt || c.submittedAt || "—"],
      ["CV Expiry", isExpired(c) ? "Outdated (6+ months)" : "Current"],
    ];

    let y = 100;
    rows.forEach(([label, value]) => {
      doc.setDrawColor(230);
      doc.rect(14, y - 14, 170, 22);
      doc.rect(184, y - 14, doc.internal.pageSize.getWidth() - 198, 22);
      doc.setFontSize(9);
      doc.setTextColor(80);
      doc.text(label, 18, y);
      doc.setTextColor(20);
      doc.text(String(value), 188, y, { maxWidth: doc.internal.pageSize.getWidth() - 210 });
      y += 24;
    });
    const missing = profileMissing(c);
    doc.setTextColor(missing.length ? 180 : 34, missing.length ? 80 : 139, missing.length ? 80 : 34);
    doc.setFontSize(10);
    doc.text(
      missing.length ? `Profile Warning: Missing ${missing.join(", ")}` : "Profile Completeness: Complete",
      14,
      y + 18,
    );
    doc.setTextColor(isExpired(c) ? 180 : 34, isExpired(c) ? 80 : 139, isExpired(c) ? 80 : 34);
    doc.text(isExpired(c) ? "CV Status: Outdated (6+ months)" : "CV Status: Current", 14, y + 34);
  });

  footer(doc, exportDate);
  doc.save(`candidate-cv-profiles-${Date.now()}.pdf`);
}

