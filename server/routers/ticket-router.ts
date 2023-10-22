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
    }),

  /**
   * PRIVATE: Assign ticket API.
   * Only agents and admin can use this API.
   */
  assignTicket: privateProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
        agentEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ticketId, agentEmail } = input;

      if (ctx.user.role === "USER" || ctx.user.role === "MANAGER")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized action",
        });

      const existingTicket = await db.ticket.findUnique({
        where: {
          id: ticketId,
          status: { not: "RESOLVED" },
        },
        include: { agent: true },
      });

      if (existingTicket?.agent?.email === agentEmail)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Ticket is already assigned to this agent",
        });

      const updatedTicket = await db.ticket.update({
        where: {
          id: ticketId,
          status: { not: "RESOLVED" },
        },
        data: {
          agent: {
            connect: { email: agentEmail },
          },
        },
        include: { agent: true },
      });

      await db.log.create({
        data: {
          text: `Ticket assigned to ${updatedTicket.agent?.name}`,
          ticketId: updatedTicket.id,
        },
      });

      return updatedTicket;
    }),

  /**
   * Query APIs start here.
   */

  /**
   * PRIVATE: Get all tickets API.
   */
  getAllTickets: privateProcedure.query(async ({ ctx }) => {
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
  }),

  /**
   * PRIVATE: Get unresolved tickets created by logged in user.
   */
  getUserTickets: privateProcedure.query(async ({ ctx }) => {
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
  }),

  /**
   * PRIVATE: Get all open tickets. Used for helpdesk.
   * Only logged in agent and admins can access this API.
   */
  getAllOpenTickets: privateProcedure.query(async ({ ctx }) => {
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
  }),

  /**
   * PRIVATE: Get assigned tickets. Used for helpdesk.
   * Only logged in agent can access this API.
   */
  getAssignedTickets: privateProcedure.query(async ({ ctx }) => {
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
    }),

  /**
   * PRIVATE: Get ticket logs.
   */
  getTicketLogs: privateProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const logs = await db.log.findMany({
        where: { ticketId: input.ticketId },
        orderBy: { createdAt: "desc" },
      });

      if (!logs)
        throw new TRPCError({ code: "NOT_FOUND", message: "No such ticket" });

      return logs;
    }),
});
