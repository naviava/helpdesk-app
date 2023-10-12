"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

interface MobileSidebarProps {}

export default function MobileSidebar({}: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-[60%] bg-white p-0">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
}
