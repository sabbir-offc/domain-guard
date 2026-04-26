import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domain Guard · NeXbit LTD",
  description: "Allowlist & block-event management for the NeXbit affiliate team."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
