"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import IconBadge from "@/components/icon-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItemProps {
  title: string;
  routes: {
    icon: any;
    label: string;
    href: string;
  }[];
}

function NavigationItem({ title, routes }: NavigationItemProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group relative flex items-center text-lg hover:cursor-pointer">
          {title}
          <div>
            <ChevronDown className="ml-2 h-5 w-5 text-muted-foreground transition delay-150 group-active:rotate-180" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {routes.map((route) => (
          <DropdownMenuItem
            key={route.label}
            className="w-full hover:bg-gray-200"
          >
            <Link href={route.href} className="flex items-center px-2 py-2">
              <IconBadge
                icon={route.icon}
                size="lg"
                className="mr-2 text-muted-foreground"
              />
              {route.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavigationItem;
