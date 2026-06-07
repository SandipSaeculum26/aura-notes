"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, PenLine, Sparkles } from "lucide-react";

const cards = [
  {
    href: "/dashboard/notes",
    title: "Notes",
    description: "Write and organize your notes.",
    Icon: FileText,
  },
  {
    href: "/dashboard/whiteboard",
    title: "Whiteboard",
    description: "Brainstorm on a flexible canvas.",
    Icon: PenLine,
  },
  {
    href: "/dashboard/chat-ai",
    title: "Chat AI",
    description: "Ask questions and get quick insights.",
    Icon: Sparkles,
  },
];

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setEmail(JSON.parse(stored).email);
  }, []);

  return (
    <div className="px-8 py-10">
      <div className="text-3xl font-semibold">
        Welcome back{email ? `, ${email}` : ""}
      </div>
      <div className="mt-2 text-sm text-slate-600">
        Pick up where you left off, or jump into a tool.
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ href, title, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#2592d1]/10 text-[#1d6fa3]">
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <div className="text-sm leading-6 text-slate-600">{description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
