"use client";

import { CourseForm } from "../_components/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Course</h1>
        <p className="text-muted-foreground">Create a new course</p>
      </div>
      <CourseForm />
    </div>
  );
}

