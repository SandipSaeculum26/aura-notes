"use client";
import { useRouter } from "next/navigation";
import { LogoIcon, NoteIcon, BoardIcon } from "./svgs";

const features = [
  {
    title: "Smart Notes",
    description: "Write in markdown with fast search and clean organization.",
    Icon: NoteIcon,
  },
  {
    title: "AI-Powered",
    description: "Generate summaries, questions, and quick insights.",
    Icon: BoardIcon,
  },
  {
    title: "Visual Whiteboards",
    description: "Brainstorm on a flexible canvas with clean sections.",
    Icon: LogoIcon,
  },
  {
    title: "Lightning Fast",
    description: "Optimized for speed with a minimal, responsive UI.",
    Icon: NoteIcon,
  },
  {
    title: "Secure by Default",
    description: "Keep your notes private and accessible only to you.",
    Icon: BoardIcon,
  },
  {
    title: "Export Anywhere",
    description: "Save as PDF, Markdown, or plain text whenever you want.",
    Icon: LogoIcon,
  },
];

export default function Home() {
    const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="w-full bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-[#3096d1] p-3 text-white shadow-sm">
              {/* <LogoIcon /> */}
            </div>
            <div>
              <div className="text-sm font-semibold">NoteAI</div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button onClick={() => router.push("/login")} className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Sign in
            </button>
            <button onClick={() => router.push("/signup")} className="rounded-md bg-[#2592d1] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d91ca] cursor-pointer">
              Get started
            </button>
          </div>
        </div>
      </header>

      <section className="w-full bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8">
          <div className="font-semibold tracking-tight text-slate-900 sm:text-5xl">Notes that think with you</div>
          <div className="mt-4 text-xl font-normal text-slate-900">
            Capture ideas, organize knowledge, and amplify your thinking.
          </div>
          <div className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
            A fresh, simple start with a clean layout, rounded card panels, and easy-to-read divs. No complexity—just the essentials.
          </div>
          <div className="mt-8 flex flex-col gap-3 items-center justify-center sm:flex-row sm:justify-center">
            <button onClick={() => router.push("/signup")} className="rounded-md bg-[#2592d1] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d91ca] cursor-pointer">
              Start for free
            </button>
            <button onClick={() => router.push("/login")} className="rounded-md border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer">
              Sign in
            </button>
          </div>
        </div>
      </section>

      <section className="w-full bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 sm:grid-cols-2 lg:grid-cols-3 sm:px-8">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-md bg-white p-6 flex flex-col gap-3 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#3096d1]/10 text-white">
                <feature.Icon />
              </div>
              <div className="text-lg font-semibold text-slate-900">{feature.title}</div>
              <div className="text-sm leading-6 text-slate-600">{feature.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
