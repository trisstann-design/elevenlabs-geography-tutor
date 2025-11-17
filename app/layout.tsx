import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ElevenLabs Geography Tutor",
  description: "Interactive Socratic learning platform powered by ElevenLabs Agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
