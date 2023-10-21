import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { PriorityEnum } from "@/types";

import { db } from "@/lib/db";
import { generateRefId } from "@/lib/generate-ref-id";
import { privateProcedure, router } from "@/server/trpc";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

export const ticketRouter = router({
  /**
   * PRIVATE: Create ticket API.
   * Takes in title*, category, department,
   * priority*(default: LOW), message*, attachment.
   */
  createTicket: privateProcedure
    .input(
      z.object({
        title: z.string().min(1).max(50),
        categoryId: z.string().nullish(),
        departmentId: z.string().nullish(),
        priority: PriorityEnum,
        message: z.string().min(3),
        attachmentUrl: z.string().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        let { departmentId } = input;
        const { title, priority, categoryId, message, attachmentUrl } = input;

        /** If department was empty when form was submitted,
         * then we assign the user's department as default.
         */
        if (!departmentId && !!ctx.user.departmentId)
          departmentId = ctx.user.departmentId;

        /** Generate a reference ID for the ticket.
         * This is the main reference ID provided when asking for support.
         * It must be unique, so while the reference ID already exists,
         * we loop to generate a new one.
         */
        let refId = generateRefId();
        let existingRefId = await db.ticket.findUnique({
          where: { refId },
        });

        while (!!existingRefId) {
          refId = generateRefId();
          existingRefId = await db.ticket.findUnique({
            where: { refId },
          });
        }

        // Create the data query object.
        const messageData: any = {
          create: {
            content: message,
            userEmail: ctx.user.email,
          },
        };

        if (!!attachmentUrl) {
          messageData.create.attachments = {
            create: {
              url: attachmentUrl,
              name: attachmentUrl.split("/").pop()!,
            },
          };
        }

        const newTicketData: any = {
          title,
          refId,
          priority,
          userEmail: ctx.user.email,
          messages: messageData,
          logs: {
            create: {
              text: `${ctx.user.name} created the ticket.`,
            },
          },
        };

        if (!!categoryId) {
          newTicketData.categoryId = categoryId;
        }

        if (!!departmentId) {
          newTicketData.departmentId = departmentId;
        }

        // Ticket is created using data query object.
        const newTicket = await db.ticket.create({ data: newTicketData });

        return { ticketId: newTicket.id };
      } catch (err) {
        console.log("[CREATE_TICKET_ERROR]", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error",
        });
      }
    }),

  /**
   * PRIVATE: Get all tickets API.
   */
  getAllTickets: privateProcedure.query(async ({ ctx }) => {
    try {
      const tickets = await db.ticket.findMany({
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          department: true,
          user: true,
          agent: true,
        },
      });

      if (!tickets)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No tickets matching the criteria",
        });

      return tickets;
    } catch (err) {
      console.log("[GET_ALL_TICKETS_ERROR]", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Error",
      });
    }
  }),

  /**
   * PRIVATE: Get unresolved tickets created by logged in user.
   */
  getUserTickets: privateProcedure.query(async ({ ctx }) => {
    try {
      const tickets = await db.ticket.findMany({
        where: {
          userEmail: ctx.user.email,
          status: { not: "RESOLVED" },
        },
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          department: true,
          user: true,
          agent: true,
        },
      });

      if (!tickets)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No tickets matching the criteria",
        });

      return tickets;
    } catch (err) {
      console.log("[GET_USER_TICKETS_ERROR]", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Error",
      });
    }
  }),

  /**
   * PRIVATE: Get all open tickets. Used for helpdesk.
   */
  getAllOpenTickets: privateProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user.role === "USER" || ctx.user.role === "MANAGER")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized action",
        });

      const tickets = await db.ticket.findMany({
        where: {
          status: { not: "RESOLVED" },
        },
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          department: true,
          user: true,
          agent: true,
        },
      });

      if (!tickets)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No tickets matching the criteria",
        });

      return tickets;
    } catch (err) {
      console.log("[GET_ALL_OPEN_TICKETS_ERROR]", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Error",
      });
    }
  }),

  /**
   * PRIVATE: Get assigned tickets. Used for helpdesk.
   * Only logged in agent can access this API.
   */
  getAssignedTickets: privateProcedure.query(async ({ ctx }) => {
    try {
      if (ctx.user.role === "USER" || ctx.user.role === "MANAGER")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized action",
        });

      const tickets = await db.ticket.findMany({
        where: {
          agentEmail: ctx.user.email,
          status: { not: "RESOLVED" },
        },
        orderBy: { updatedAt: "desc" },
        include: {
          category: true,
          department: true,
          user: true,
          agent: true,
        },
      });

      if (!tickets)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No tickets matching the criteria",
        });

      return tickets;
    } catch (err) {
      console.log("[GET_ASSIGNED_TICKETS_ERROR]", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Error",
      });
    }
  }),

  /**
   * PRIVATE: Get ticket by ID. Is only accessible to
   * helpdesk and the user who created the ticket.
   */
  getTicketById: privateProcedure
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let dataQuery: any = { id: input.id };

        if (ctx.user.role === "USER" || ctx.user.role === "MANAGER")
          dataQuery = { id: input.id, userEmail: ctx.user.email };

        const ticket = await db.ticket.findUnique({
          where: dataQuery,
          include: {
            category: true,
            department: true,
            user: true,
            agent: true,
          },
        });

        if (!ticket)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Ticket not found",
          });

        return ticket;
      } catch (err) {
        console.log("[GET_ASSIGNED_TICKETS_ERROR]", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error",
        });
      }
    }),
});
