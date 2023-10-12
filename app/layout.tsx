import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import AllProviders from "@/components/providers/all-providers";

import { cn } from "@/lib/utils";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helpdesk Management",
  description: "Service Desk application for IT Support.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-slate-100 text-gray-950 dark:bg-slate-900 dark:text-gray-50",
          font.className,
        )}
      >
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
