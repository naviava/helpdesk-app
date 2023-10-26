"use client";

import {
  CheckCircle,
  Cuboid,
  GanttChart,
  PlusCircle,
  User,
} from "lucide-react";

import NavigationItem from "./navigation-item";

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

function NavigationItems() {
  return (
    <div className="hidden items-center gap-x-20 md:flex lg:absolute lg:gap-x-14 lg:pl-[20rem] xl:pl-[30rem]">
      <NavigationItem title="My Tickets" routes={userRoutes} />
      <NavigationItem title="Helpdesk" routes={helpdeskRoutes} />
    </div>
  );
}

export default NavigationItems;
