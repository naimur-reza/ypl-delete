"use client";

import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/job-card";

interface Career {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  category: string;
  postedDate: string;
  slug: string;
}

export default function JobsPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((data) => {
        setCareers(data.filter((c: Career) => c));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    "All Categories",
    ...new Set(careers.map((c) => c.category).filter(Boolean)),
  ];
  const locations = [
    "All Locations",
    ...new Set(careers.map((c) => c.location).filter(Boolean)),
  ];
  const jobTypes = [
    "All Types",
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
  ];

  const filtered = careers.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategory === "All Categories" || c.category === selectedCategory;
    const matchLoc =
      selectedLocation === "All Locations" || c.location === selectedLocation;
    const matchType = selectedType === "All Types" || c.type === selectedType;
    return matchSearch && matchCat && matchLoc && matchType;
  });

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSearchQuery("");
  };

  const activeFilters = [
    selectedCategory !== "All Categories" ? selectedCategory : null,
    selectedLocation !== "All Locations" ? selectedLocation : null,
    selectedType !== "All Types" ? selectedType : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <section className="relative overflow-hidden bg-secondary py-16 lg:py-20">
        <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center gap-2 roundecd-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Career Opportunities
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
              Find a role that matches your
              <span className="text-primary italic"> ambition</span>
            </h1>
            <p className="text-lg text-secondary-foreground/75">
              Explore curated openings across industries, apply instantly, or
              join our CV bank to get matched by our recruitment team.
            </p>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-xl font-bold text-secondary-foreground">
                {careers.length}
              </p>
              <p className="text-xs text-secondary-foreground/70">Open Roles</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-xl font-bold text-secondary-foreground">
                {Math.max(locations.length - 1, 0)}
              </p>
              <p className="text-xs text-secondary-foreground/70">Locations</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-xl font-bold text-secondary-foreground">
                {Math.max(categories.length - 1, 0)}
              </p>
              <p className="text-xs text-secondary-foreground/70">Categories</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-xl font-bold text-secondary-foreground">
                {jobTypes.length - 1}
              </p>
              <p className="text-xs text-secondary-foreground/70">Job Types</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by role, company, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 rounded-xl border-border/70 pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-xl bg-transparent sm:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {activeFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {activeFilters.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {f}
                  </span>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full px-3 text-xs"
                  onClick={clearFilters}
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
              <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Filter jobs</h2>
                </div>
                <div className="space-y-5">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger id="category" className="mt-2 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger id="location" className="mt-2 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger id="type" className="mt-2 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl bg-transparent"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading roles..."
                    : `${filtered.length} roles available`}
                </p>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-56 animate-pulse rounded-2xl border border-border/60 bg-muted/30"
                    />
                  ))}
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filtered.map((career) => (
                    <JobCard key={career._id} job={career} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    No matching jobs found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try changing filters or search by a different title/company.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-5 rounded-xl bg-transparent"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
