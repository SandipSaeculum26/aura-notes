"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save the logged-in user and head to the dashboard
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-20 sm:px-8">
        <div className="rounded-md bg-white px-5 py-10 sm:p-10 shadow-sm ring-1 ring-slate-200">
          <div className="text-3xl font-semibold text-slate-900">Login</div>
          <div className="mt-3 text-sm leading-6 text-slate-600">
            Enter your credentials to continue to Aura Notes.
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
            {error && <div className="text-sm font-medium text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <button onClick={() => router.push("/signup")} className="font-semibold text-blue-800 hover:underline">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
