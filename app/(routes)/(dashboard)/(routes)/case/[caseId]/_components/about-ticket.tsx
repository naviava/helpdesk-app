import { serverClient } from "@/app/_trpc/server-client";
import AssignTicketButton from "@/components/assign-ticket-button";
import PriorityTag from "@/components/priority-tag";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AboutTicketProps {
  ticket: Awaited<ReturnType<(typeof serverClient)["ticket"]["getTicketById"]>>;
}

export default async function AboutTicket({ ticket }: AboutTicketProps) {
  const user = await serverClient.user.getUserProfile();

  return (
    <section className="space-y-4 p-2 lg:space-y-6">
      {/* Ticket owner and priority. */}
      <div className="flex items-center">
        {/* Ticket owner. */}
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Ticket Owner</h4>
          <p>{ticket.owner.name}</p>
        </div>
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Priority</h4>
          <PriorityTag priority={ticket.priority} />
        </div>
      </div>
      {/* Category and department. */}
      <div className="flex items-center">
        {/* Category. */}
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Category</h4>
          <p
            className={cn(
              !ticket.category?.name && "italic text-muted-foreground",
            )}
          >
            {ticket.category?.name ? ticket.category?.name : "Uncategorized"}
          </p>
        </div>
        {/* Department. */}
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Department</h4>
          <p
            className={cn(
              !ticket.department?.name && "italic text-muted-foreground",
            )}
          >
            {ticket.department?.name
              ? ticket.department?.name
              : "No department"}
          </p>
        </div>
      </div>
      {/* Assigned to and assign to me button. */}
      <div className="flex items-center">
        {/* Agent name. */}
        <div className="flex-1">
          <div>
            <h4 className="font-light text-muted-foreground">Assigned to</h4>
            <p
              className={cn(
                !ticket.agent?.name &&
                  "font-medium italic text-muted-foreground",
              )}
            >
              {ticket.agent?.name ? ticket.agent?.name : "Unassigned"}
            </p>
          </div>
        </div>
        {/* Assign to me button. */}
        <div className="flex-1">
          {(user?.role === "AGENT" || user?.role === "ADMIN") && (
            <AssignTicketButton />
          )}
        </div>
      </div>
      {/* Created and updated dates. */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Created at</h4>
          <p>{format(new Date(ticket.createdAt), "MMM dd yyyy @ hh:mm")}</p>
        </div>
        <div className="flex-1">
          <h4 className="font-light text-muted-foreground">Last update</h4>
          <p>{format(new Date(ticket.updatedAt), "MMM dd yyyy @ hh:mm")}</p>
        </div>
      </div>
    </section>
  );
}
