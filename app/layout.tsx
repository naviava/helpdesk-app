import "./globals.css";
import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";

import AllProviders from "@/components/providers/all-providers";

import { cn } from "@/lib/utils";

const font = Lexend_Deca({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "Helpdesk Management",
  title: "Helpdesk",
  description: "ITSM at your fingertips.",
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Helpdesk Management",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Helpdesk",
    title: {
      default: "Helpdesk Management",
      template: "Helpdesk Management",
    },
    description: "ITSM at your fingertips.",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Helpdesk Management",
      template: "Helpdesk Management",
    },
    description: "ITSM at your fingertips.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
