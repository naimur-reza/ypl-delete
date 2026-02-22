"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCrud } from "@/hooks/use-crud";
import { DataTable, Column } from "@/components/dashboard/data-table";
import { CrudModal } from "@/components/dashboard/crud-modal";
import { DeleteDialog } from "@/components/dashboard/delete-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";

interface Branch { _id: string; name: string; }
interface Career {
  _id?: string;
  title: string;
  slug: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary: string;
  category: string;
  department: string;
  branch: string | Branch;
  postedDate: string;
  isActive: boolean;
}

const defaultValues: Career = {
  title: "", slug: "", company: "", description: "", requirements: [],
  location: "", type: "Full-time", salary: "", category: "", department: "",
  branch: "", postedDate: "", isActive: true,
};

export default function CareersPage() {
  const { items, isLoading, create, update, remove } = useCrud<Career>("/api/careers");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Career | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Career | null>(null);
  const [form, setForm] = useState<Career>(defaultValues);
  const [reqInput, setReqInput] = useState("");

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then(setBranches).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setForm(defaultValues); setReqInput(""); setModalOpen(true); };
  const openEdit = (item: Career) => {
    setEditing(item);
    setForm({
      ...item,
      branch: typeof item.branch === "object" ? item.branch?._id : item.branch || "",
    });
    setReqInput("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const ok = editing?._id ? await update(editing._id, payload) : await create(payload);
    if (ok) setModalOpen(false);
  };

  const addRequirement = () => {
    if (reqInput.trim()) {
      setForm({ ...form, requirements: [...form.requirements, reqInput.trim()] });
      setReqInput("");
    }
  };

  const removeRequirement = (index: number) => {
    setForm({ ...form, requirements: form.requirements.filter((_, i) => i !== index) });
  };

  const branchName = (b: string | Branch) =>
    typeof b === "object" ? b?.name : branches.find((br) => br._id === b)?.name || "—";

  const columns: Column<Career>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "type", label: "Type" },
    { key: "category", label: "Category" },
    {
      key: "branch", label: "Branch",
      render: (item) => <Badge variant="outline">{branchName(item.branch)}</Badge>,
    },
    {
      key: "isActive", label: "Status",
      render: (item) => <Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Careers"
        description="Manage job postings and career opportunities"
        action={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-2" /> Add Career</Button>}
      />

      <DataTable
        title="All Careers"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["title", "company", "location", "category"]}
        actions={(item) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
          </>
        )}
      />

      <CrudModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Career" : "Add Career"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Auto-generated from title" />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <textarea className="w-full min-h-[80px] rounded-md border border-input px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Requirements</Label>
            <div className="flex gap-2">
              <Input value={reqInput} onChange={(e) => setReqInput(e.target.value)} placeholder="Add a requirement" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addRequirement(); } }} />
              <Button type="button" variant="outline" size="sm" onClick={addRequirement}>Add</Button>
            </div>
            {form.requirements.length > 0 && (
              <ul className="mt-2 space-y-1">
                {form.requirements.map((req, i) => (
                  <li key={i} className="flex items-center justify-between rounded bg-muted px-3 py-1.5 text-sm">
                    <span>{req}</span>
                    <button type="button" onClick={() => removeRequirement(i)} className="text-red-500 hover:text-red-700 text-xs ml-2">×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label>Branch</Label>
            <Select value={typeof form.branch === "string" ? form.branch : ""} onValueChange={(v) => setForm({ ...form, branch: v })}>
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location *</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Technology, Finance" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Full-time", "Part-time", "Contract", "Temporary"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Salary</Label>
              <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="e.g. £50,000 - £65,000" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>Active</Label>
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
        </form>
      </CrudModal>

      <DeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => remove(deleteTarget!._id!)} title="Delete Career" />
    </div>
  );
}
