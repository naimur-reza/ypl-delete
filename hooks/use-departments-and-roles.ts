"use client";

import { useState, useEffect, useCallback } from "react";

export type DepartmentOption = { _id: string; name: string };
export type RoleOption = { _id: string; name: string };

export function useDepartmentsAndRoles() {
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  useEffect(() => {
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data: DepartmentOption[]) => setDepartments(data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const onDepartmentNameChange = useCallback(
    (departmentName: string, resetRole: () => void) => {
      resetRole();
      const dept = departments.find((d) => d.name === departmentName);
      if (dept) {
        fetch(`/api/roles?departmentId=${dept._id}`)
          .then((res) => res.json())
          .then((data: RoleOption[]) => setRoles(data))
          .catch((err) => console.error("Error fetching roles:", err));
      } else {
        setRoles([]);
      }
    },
    [departments],
  );

  return { departments, roles, onDepartmentNameChange };
}
