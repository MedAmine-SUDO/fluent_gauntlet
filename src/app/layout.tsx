import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/provider";

export const metadata: Metadata = {
  title: "English Gauntlet | Master TOEIC & IELTS",
  description: "Master synonyms, inverses, and exam tricks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
