"use client";

import { ElementRef, useCallback, useRef } from "react";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  const ref = useRef<ElementRef<"button">>(null);

  const handleSheetClose = useCallback(() => ref.current?.click(), []);

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="pr-4 transition hover:opacity-75">
          <Menu />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[60%] bg-white p-0 md:w-[30%] lg:w-[25%]"
        >
          <Sidebar closeSidebar={handleSheetClose} />
          <SheetClose ref={ref} className="hidden" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
