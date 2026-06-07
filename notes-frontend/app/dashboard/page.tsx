"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      // Not logged in — send back to login
      router.replace("/login");
      return;
    }
    setEmail(JSON.parse(stored).email);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-900">
      <h1 className="text-4xl font-semibold">Hello dashboard</h1>
      {email && <p className="text-sm text-slate-600">Signed in as {email}</p>}
      <button
        onClick={handleLogout}
        className="rounded-full bg-blue-800 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Log out
      </button>
    </div>
  );
}
