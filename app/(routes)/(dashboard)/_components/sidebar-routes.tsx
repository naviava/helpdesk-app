"use client";

import { GanttChart, PlusCircle, ShieldPlus, Cuboid, User } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarPanelHeader from "./sidebar-panel-header";
import SidebarItem from "./sidebar-item";

import { trpc } from "@/app/_trpc/client";

interface SidebarRoutesProps {}

const userRoutes = [
  {
    icon: PlusCircle,
    label: "New Ticket",
    href: "/user/create-ticket",
  },
  {
    icon: GanttChart,
    label: "My Tickets",
    href: "/user/tickets",
  },
];

const helpdeskRoutes = [
  {
    icon: User,
    label: "Assigned to me",
    href: "/agent/assigned",
  },
  {
    icon: Cuboid,
    label: "Open Tickets",
    href: "/agent/all-tickets",
  },
];

export default function SidebarRoutes({}: SidebarRoutesProps) {
  const { data: user } = trpc.user.getUserProfile.useQuery();

  return (
    <ScrollArea className="mt-24 w-full">
      <div className="space-y-20">
        {/* Helpdesk Routes */}
        {(user?.role === "ADMIN" || user?.role === "AGENT") && (
          <section>
            <SidebarPanelHeader text="Helpdesk" />
            <Separator />
            {helpdeskRoutes.map((route) => (
              <SidebarItem
                key={route.label}
                icon={route.icon}
                label={route.label}
                href={route.href}
              />
            ))}
          </section>
        )}
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
      </div>
    </ScrollArea>
  );
}
