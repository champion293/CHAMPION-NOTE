import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Notes — Write, Share, Total. | by ABDUL MATEEN",
  description:
    "A beautiful no-login notepad. Write freely, auto-detect totals, share instantly. Developed by Abdul Mateen.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05050f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-purple-500/40">
        {children}
      </body>
    </html>
  );
}
