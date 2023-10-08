import "./globals.css";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

import { getServerSession } from "next-auth";

import SessionProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const font = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Helpdesk Management",
  description: "Service Desk application for IT Support.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={cn("text-gray-950 dark:text-gray-50", font.className)}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
