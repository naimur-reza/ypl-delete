"use client";

import { BlogForm } from "../_components/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Blog</h1>
        <p className="text-muted-foreground">Create a new blog post</p>
      </div>
      <BlogForm />
    </div>
  );
}

