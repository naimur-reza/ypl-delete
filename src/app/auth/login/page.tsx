"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res?.error) {
      setError(res.error);
      setMessage(null);
    } else if (res?.success) {
      setMessage(res.success);
      setError(null);
      router.push("/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-background flex">
      {/* Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Header with Logo */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-border">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0">
              <Image src="/logo.svg" alt="Logo" width={110} height={110} />
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Admin Portal</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-foreground tracking-tight">
                Manager Access
              </h2>
              <p className="text-muted-foreground">
                Authorized personnel only. Enter your admin credentials.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-foreground"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@company.com"
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`
                      w-full px-4 py-3.5 rounded-lg border bg-input text-foreground
                      placeholder:text-muted-foreground/60
                      transition-all duration-200
                      ${focusedField === "email" 
                        ? "border-foreground ring-1 ring-foreground/20" 
                        : "border-border hover:border-foreground/30"
                      }
                    `}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-foreground"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`
                      w-full px-4 py-3.5 pr-12 rounded-lg border bg-input text-foreground
                      placeholder:text-muted-foreground/60
                      transition-all duration-200
                      ${focusedField === "password" 
                        ? "border-foreground ring-1 ring-foreground/20" 
                        : "border-border hover:border-foreground/30"
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 cursor-pointer hover:bg-slate-50/50 rounded-full top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full flex items-center justify-center gap-2 
                  px-4 py-3.5 rounded-lg
                  bg-primary text-primary-foreground font-medium
                  hover:bg-primary/90 
                  disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer
                  transition-all duration-200
                  group
                "
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 lg:p-8 border-t border-border text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            System Status: Operational
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              IT Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
