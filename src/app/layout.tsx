import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PilotOps AI",
  description: "First-pilot strategy control room for warehouse automation market entry.",
  icons: {
    icon: "/brand/pilotops-mark.png",
    apple: "/brand/pilotops-mark.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
