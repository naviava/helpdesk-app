"use client";

import { GanttChart, PlusCircle, ShieldPlus, Cuboid } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarPanelHeader from "./sidebar-panel-header";
import SidebarItem from "./sidebar-item";

import { trpc } from "@/app/_trpc/client";

interface SidebarRoutesProps {}

const userRoutes = [
  {
    icon: PlusCircle,
    label: "Create Ticket",
    href: "/user/create-ticket",
  },
  {
    icon: GanttChart,
    label: "My Tickets",
    href: "/user/tickets",
  },
];

const managerRoutes = [
  {
    icon: ShieldPlus,
    label: "Create Request",
    href: "/manager/create-request",
  },
  {
    icon: Cuboid,
    label: "All Requests",
    href: "/manager/requests",
  },
];

export default function SidebarRoutes({}: SidebarRoutesProps) {
  const { data: user } = trpc.getUserProfile.useQuery();

  return (
    <ScrollArea className="mt-24 w-full">
      <div className="space-y-20">
        {/* User Routes */}
        <section>
          <SidebarPanelHeader text="Manage Tickets" />
          <Separator />
          {userRoutes.map((route) => (
            <SidebarItem
              key={route.label}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))}
        </section>
        {/* Manager Routes */}
        <section>
          <SidebarPanelHeader text="Manage Requests" />
          <Separator />
          {managerRoutes.map((route) => (
            <SidebarItem
              key={route.label}
              icon={route.icon}
              label={route.label}
              href={route.href}
            />
          ))}
        </section>
      </div>
    </ScrollArea>
  );
}
