"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  MapPin,
  Globe,
  GraduationCap,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCountry } from "@/lib/country-context";

function BookConsultationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const countryContext = useCountry();
  const searchParams = useSearchParams();

  // Get the country name directly from context
  const getInitialCountry = () => {
    if (countryContext.countryName && countryContext.country !== "global") {
      return countryContext.countryName;
    }
    return "";
  };

  // Get initial destination from query params
  const initialDestination = searchParams.get("destination") || "";

  // Simple form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    country: getInitialCountry(),
    destination: initialDestination,
    qualification: "",
    englishTest: "",
    testScore: "",
    additionalInfo: "",
  });

  // Update initial fields if context or params change (only if not already set by user)
  useEffect(() => {
    if (!formData.country) {
      const country = getInitialCountry();
      if (country) setFormData(prev => ({ ...prev, country }));
    }
    if (!formData.destination) {
      const dest = searchParams.get("destination");
      if (dest) setFormData(prev => ({ ...prev, destination: dest }));
    }
  }, [countryContext.countryName, searchParams]);

   const [errors, setErrors] = useState<Record<string, string>>({});

  const countries = [
    "Bangladesh",
    "India",
    "Nepal",
    "Sri Lanka",
    "Pakistan",
    "Nigeria",
    "Ghana",
    "United Kingdom",
    "USA",
    "Canada",
    "Australia",
    "Germany",
    "Finland",
    "Sweden",
    "Denmark",
    "Malaysia",
    "Other",
  ];

  const testTypes = [
    "IELTS",
    "TOEFL",
    "PTE",
    "Duolingo",
    "OIETC",
    "Internal Test",
    "None / Not taken yet",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.destination.trim())
      newErrors.destination = "Destination is required";
    if (!formData.qualification.trim())
      newErrors.qualification = "Qualification is required";
    if (!formData.englishTest)
      newErrors.englishTest = "Please select an option";

    // Conditional validation: if they have a test, they likely need a score,
    // unless they selected "None".
    if (
      formData.englishTest &&
      formData.englishTest !== "None / Not taken yet" &&
      !formData.testScore.trim()
    ) {
      newErrors.testScore = "Score is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: JSON.stringify({
            city: formData.city,
            country: formData.country,
            destination: formData.destination,
            qualification: formData.qualification,
            englishTest: formData.englishTest,
            testScore: formData.testScore,
            additionalInfo: formData.additionalInfo,
          }),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        form: (err as Error).message || "Submission failed",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-6xl mx-auto my-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Request Received!
        </h2>
        <p className="text-slate-600 max-w-md">
          Thank you for reaching out. One of our expert counselors will review
          your profile and contact you within 24 hours.
        </p>
        <Link
          href={"/apply-now"}
          onClick={() => setIsSuccess(false)}
          className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
        >
          Book Another Consultation
        </Link>
      </div>
    );
  }

  return (
    <section className="py-10 px-4 md:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto bg-white rounded-md shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h1 className="relative z-10 text-3xl md:text-4xl font-bold text-white mb-3">
            Book Your Free Consultation
          </h1>
          <p className="relative z-10 text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            Start your journey abroad today by filling the form below! Our
            experts are here to help you match with the perfect university.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          {/* Section: Personal Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. John Doe"
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
              />
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="+880 1XXX XXXXXX"
              />

              {/* Address Group */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.city
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      } focus:ring-4 focus:outline-none transition-all bg-slate-50 focus:bg-white`}
                    />
                    <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border appearance-none ${
                        errors.country
                          ? "border-red-300 focus:ring-red-200"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      } focus:ring-4 focus:outline-none transition-all bg-slate-50 focus:bg-white`}
                    >
                      <option value="" disabled>
                        Country
                      </option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                {(errors.city || errors.country) && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Location details
                    required
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section: Academic & Preferences */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Academic Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Preferred Study Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                error={errors.destination}
                placeholder="e.g. United Kingdom, Canada"
              />

              <InputField
                label="Last Education Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                error={errors.qualification}
                placeholder="e.g. HSC / A-Levels / Bachelor's"
                icon={
                  <GraduationCap className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Do you have any English test?"
                name="englishTest"
                value={formData.englishTest}
                onChange={handleChange}
                options={testTypes}
                error={errors.englishTest}
                placeholder="Select Test Type"
              />

              <InputField
                label="Test Score (If applicable)"
                name="testScore"
                value={formData.testScore}
                onChange={handleChange}
                error={errors.testScore}
                placeholder="e.g. 6.5"
                disabled={
                  !formData.englishTest ||
                  formData.englishTest === "None / Not taken yet"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Additional Information
              </label>
              <div className="relative">
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us more about your study plans or any specific questions..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all bg-slate-50 focus:bg-white resize-none"
                />
                <FileText className="absolute right-3 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4   ">
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-1/2 mx-auto cursor-pointer py-4 px-6 rounded-xl text-lg font-bold text-white shadow-lg shadow-red-500/20 transform transition-all duration-200 
                ${
                  isLoading
                    ? "bg-red-400 cursor-not-allowed scale-[0.99]"
                    : "bg-red-600 hover:bg-red-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Get Started for Free"
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              By clicking submit, you agree to our privacy policy and allow us
              to contact you regarding your inquiry.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function BookConsultation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <BookConsultationForm />
    </Suspense>
  );
}

// Reusable Input Component for cleaner code
const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
  icon,
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">
      {label} {!disabled && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        } focus:ring-4 focus:outline-none transition-all bg-slate-50 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400`}
      />
      {icon}
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);

// Reusable Select Component
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
}: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-xl border appearance-none ${
          error
            ? "border-red-300 focus:ring-red-200"
            : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
        } focus:ring-4 focus:outline-none transition-all bg-slate-50 focus:bg-white cursor-pointer`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);
