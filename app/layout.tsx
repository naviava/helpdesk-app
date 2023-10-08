import "./globals.css";
import type { Metadata } from "next";
import { Karla } from "next/font/google";

const font = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helpdesk Management",
  description: "Service Desk application for IT Support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
