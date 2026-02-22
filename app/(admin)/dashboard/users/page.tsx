"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
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
interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "manager";
  branch?: string | Branch;
  isActive: boolean;
}

const defaultValues: User = {
  name: "", email: "", password: "", role: "manager", branch: "", isActive: true,
};

const roleColors: Record<string, string> = {
  superadmin: "bg-violet-500/10 text-violet-600 border-violet-200",
  admin: "bg-blue-500/10 text-blue-600 border-blue-200",
  manager: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
};

export default function UsersPage() {
  const { items, isLoading, create, update, remove } = useCrud<User>("/api/users");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [form, setForm] = useState<User>(defaultValues);

  useEffect(() => {
    fetch("/api/branches").then((r) => r.json()).then(setBranches).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setForm(defaultValues); setModalOpen(true); };
  const openEdit = (item: User) => {
    setEditing(item);
    setForm({
      ...item,
      password: "",
      branch: typeof item.branch === "object" ? item.branch?._id : item.branch || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    const ok = editing?._id
      ? await update(editing._id, payload)
      : await create(payload);
    if (ok) setModalOpen(false);
  };

  const branchName = (b?: string | Branch) => {
    if (!b) return "—";
    return typeof b === "object" ? b.name : branches.find((br) => br._id === b)?.name || "—";
  };

  const columns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    {
      key: "role", label: "Role",
      render: (item) => (
        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${roleColors[item.role]}`}>
          {item.role}
        </span>
      ),
    },
    { key: "branch", label: "Branch", render: (item) => branchName(item.branch) },
    {
      key: "isActive", label: "Status",
      render: (item) => <Badge variant={item.isActive ? "default" : "secondary"}>{item.isActive ? "Active" : "Inactive"}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="User Management"
        description="Manage admin users and roles"
        action={<Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-2" /> Add User</Button>}
      />

      <DataTable
        title="All Users"
        columns={columns}
        data={items}
        isLoading={isLoading}
        searchKeys={["name", "email"]}
        actions={(item) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
          </>
        )}
      />

      <CrudModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "Add User"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>{editing ? "New Password (leave blank to keep)" : "Password"}</Label>
            <Input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} {...(!editing && { required: true })} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Branch (for managers)</Label>
            <Select value={typeof form.branch === "string" ? form.branch : ""} onValueChange={(v) => setForm({ ...form, branch: v })}>
              <SelectTrigger><SelectValue placeholder="No branch" /></SelectTrigger>
              <SelectContent>
             
                {branches.map((b) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <Label>Active</Label>
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
        </form>
      </CrudModal>

      <DeleteDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => remove(deleteTarget!._id!)} title="Delete User" />
    </div>
  );
}
