"use client";

import * as React from "react";
import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggleButton() {
  const { theme, systemTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-slate-300 bg-transparent"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
          {theme === "light" && (
            <Check className="ml-auto h-4 w-4 text-neutral-400" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
          {theme === "dark" && (
            <Check className="ml-auto h-4 w-4 text-neutral-500" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
          {theme === "system" && (
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                systemTheme === "light" && "text-neutral-400",
                systemTheme === "dark" && "text-neutral-500",
              )}
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
