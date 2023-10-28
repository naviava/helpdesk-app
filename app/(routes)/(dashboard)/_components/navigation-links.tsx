"use client";

import {
  CheckCircle,
  Cuboid,
  GanttChart,
  PlusCircle,
  User,
} from "lucide-react";

import NavigationItem from "./navigation-item";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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

interface NavigationItemsProps {
  isHelpdesk: boolean;
}

function NavigationItems({ isHelpdesk }: NavigationItemsProps) {
  const params = useParams();
  const isTicketPage = useMemo(() => !!params?.caseId, [params?.caseId]);

  return (
    <div
      className={cn(
        "hidden items-center gap-x-20 md:flex lg:absolute lg:gap-x-14",
        isTicketPage
          ? "lg:pl-[20rem] xl:pl-[30rem]"
          : "lg:absolute lg:left-[50%] lg:-translate-x-1/2",
      )}
    >
      <NavigationItem title="My Tickets" routes={userRoutes} />
      {isHelpdesk && (
        <NavigationItem title="Helpdesk" routes={helpdeskRoutes} />
      )}
    </div>
  );
}

export default NavigationItems;
