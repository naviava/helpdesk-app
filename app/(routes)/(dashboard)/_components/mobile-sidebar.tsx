"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="pr-4 transition hover:opacity-75 md:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="w-[60%] bg-white p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden md:block xl:hidden">
        <Sheet>
          <SheetTrigger className="pr-4 transition hover:opacity-75 lg:block xl:hidden">
            <Menu />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[30%] bg-white p-0 lg:w-[25%]"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
