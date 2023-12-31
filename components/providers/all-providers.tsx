import { Toaster } from "sonner";
import { getServerSession } from "next-auth";

import ModalProvider from "./modal-provider";
import SessionProvider from "./session-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import TRPCProvider from "@/app/_trpc/trpc-provider";

interface AllProvidersProps {
  children: React.ReactNode;
}

export default async function AllProviders({ children }: AllProvidersProps) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <TRPCProvider>
        <EdgeStoreProvider>
          <ModalProvider />
          {children}
        </EdgeStoreProvider>
        <Toaster position="top-center" />
      </TRPCProvider>
    </SessionProvider>
  );
}
