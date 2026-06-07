import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Aura Notes",
  description: "Your notes workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="bg-white text-neutral-900 antialiased">
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
