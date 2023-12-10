import "./globals.css";
import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";

import AllProviders from "@/components/providers/all-providers";

import { cn } from "@/lib/utils";

const font = Lexend_Deca({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "Ticket It",
  title: {
    default: "Ticket It Helpdesk",
    template: `%s | Ticket It`,
  },
  description: "ITSM at your fingertips.",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ticket It Helpdesk",
    startupImage: "/logo.png",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Ticket It",
    title: {
      default: "Ticket It Helpdesk",
      template: `%s | Ticket It`,
    },
    description: "ITSM at your fingertips.",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Ticket It Helpdesk",
      template: `%s | Ticket It`,
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
      <body className={cn("bg-slate-100 text-gray-950", font.className)}>
        <AllProviders>{children}</AllProviders>
      </body>
    </html>
  );
}
