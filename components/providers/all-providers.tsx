import { getServerSession } from "next-auth";

import TRPCProvider from "@/app/_trpc/trpc-provider";
import { ThemeProvider } from "./theme-provider";
import SessionProvider from "./session-provider";
import NextUIProvider from "./next-ui-provider";

interface AllProvidersProps {
  children: React.ReactNode;
}

export default async function AllProviders({ children }: AllProvidersProps) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>{children}</TRPCProvider>
        </ThemeProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
