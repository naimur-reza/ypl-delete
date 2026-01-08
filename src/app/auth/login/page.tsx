"use client";

import { useState } from "react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
  };

  return (
    <div className="flex flex-col gap-4 w-sm mx-auto   -translate-y-1/2 absolute left-1/2 top-1/2 -translate-x-1/2">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="email"
          placeholder="Email"
          defaultValue={"nwc@gmail.com"}
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          defaultValue={"Nwc@123"}
          placeholder="Password"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white rounded p-2">
          Login
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
    </div>
  );
}
