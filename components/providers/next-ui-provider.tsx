"use client";

import { NextUIProvider as ThemeProvider } from "@nextui-org/react";

interface NextUIProviderProps {
  children: React.ReactNode;
}

export default function NextUIProvider({ children }: NextUIProviderProps) {
  return <ThemeProvider style={{ height: "100%" }}>{children}</ThemeProvider>;
}
