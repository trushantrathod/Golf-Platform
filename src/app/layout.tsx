import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golf Performance & Charity",
  description: "A subscription-driven platform combining golf tracking and charitable giving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="antialiased selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}