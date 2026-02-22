"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

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

  const categories = ["All Categories", ...new Set(careers.map((c) => c.category).filter(Boolean))];
  const locations = ["All Locations", ...new Set(careers.map((c) => c.location).filter(Boolean))];
  const jobTypes = ["All Types", "Full-time", "Part-time", "Contract", "Temporary"];

  const filtered = careers.filter((c) => {
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "All Categories" || c.category === selectedCategory;
    const matchLoc = selectedLocation === "All Locations" || c.location === selectedLocation;
    const matchType = selectedType === "All Types" || c.type === selectedType;
    return matchSearch && matchCat && matchLoc && matchType;
  });

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setSearchQuery("");
  };

  return (
    <>
      <section className="bg-primary py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Find Your Next Role</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">Browse our latest job opportunities across multiple industries and locations.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search jobs by title or company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" className="sm:hidden bg-transparent" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="font-semibold text-foreground">Filters</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger id="category" className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger id="location" className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger id="type" className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>Clear Filters</Button>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `Showing ${filtered.length} jobs`}
                </p>
              </div>

              {!loading && filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {filtered.map((career) => (
                    <Link key={career._id} href={`/jobs/${career._id}`} className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                      <div className="mb-3 flex items-start justify-between">
                        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{career.type}</span>
                        <span className="text-xs text-muted-foreground">{new Date(career.postedDate).toLocaleDateString()}</span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">{career.title}</h3>
                      <div className="mb-4 space-y-2">
                        {career.company && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4 text-primary/70" /><span>{career.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary/70" /><span>{career.location}</span>
                        </div>
                        {career.salary && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary/70" /><span>{career.salary}</span>
                          </div>
                        )}
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{career.description}</p>
                    </Link>
                  ))}
                </div>
              ) : !loading ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>Clear Filters</Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
