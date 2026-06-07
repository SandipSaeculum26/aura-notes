"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, PenLine, Sparkles, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/notes", label: "Notes", Icon: FileText },
  { href: "/dashboard/whiteboard", label: "Whiteboard", Icon: PenLine },
  { href: "/dashboard/chat-ai", label: "Chat AI", Icon: Sparkles },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setEmail(JSON.parse(stored).email);
    setReady(true);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  // Avoid flashing protected content before the auth check resolves
  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="rounded-md bg-[#2592d1] px-2 py-1 text-sm font-semibold text-white">
            Aura
          </div>
          <span className="text-sm font-semibold text-slate-900">Notes</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#2592d1]/10 text-[#1d6fa3]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-3 py-4">
          {email && (
            <p className="px-3 pb-2 text-xs text-slate-500 truncate">{email}</p>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
