"use client";

import {
  GanttChart,
  PlusCircle,
  ShieldPlus,
  Cuboid,
  User,
  CheckCircle,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarPanelHeader from "./sidebar-panel-header";
import SidebarItem from "./sidebar-item";

import { trpc } from "@/app/_trpc/client";

const userRoutes = [
  {
    icon: PlusCircle,
    label: "New Ticket",
    href: "/user/create-ticket",
  },
  {
    icon: GanttChart,
    label: "Open Tickets",
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
  {
    icon: CheckCircle,
    label: "Resolved Tickets",
    href: "/agent/resolved-tickets",
  },
];

interface Props {
  closeSidebar: () => void;
}

export default function SidebarRoutes({ closeSidebar }: Props) {
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
                closeSidebar={closeSidebar}
              />
            ))}
          </section>
        )}
        {/* User Routes */}
        <section>
          <SidebarPanelHeader text="My Tickets" />
          <Separator />
          {userRoutes.map((route) => (
            <SidebarItem
              key={route.label}
              icon={route.icon}
              label={route.label}
              href={route.href}
              closeSidebar={closeSidebar}
            />
          ))}
        </section>
      </div>
    </ScrollArea>
  );
}
