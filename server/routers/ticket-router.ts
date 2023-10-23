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
        attachmentUrl: z.array(z.string()).nullish(),
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

      const newTicketData: any = {
        title,
        refId,
        priority,
        userEmail: ctx.user.email,
      };

      if (!!categoryId) {
        newTicketData.categoryId = categoryId;
      }

      if (!!departmentId) {
        newTicketData.departmentId = departmentId;
      }

      if (!!attachmentUrl && attachmentUrl?.length > 5)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Max 5 files allowed",
        });

      // Ticket is created using data query object.
      const newTicket = await db.ticket.create({ data: newTicketData });

      // Log created for ticket cretion.
      await db.log.create({
        data: {
          ticketId: newTicket.id,
          text: `${ctx.user.name} created the ticket.`,
        },
      });

      // Message is created.
      const newMessage = await db.message.create({
        data: {
          content: message,
          userEmail: ctx.user.email,
          ticketId: newTicket.id,
        },
      });

      // Log created for message.
      if (!!newMessage) {
        await db.log.create({
          data: {
            ticketId: newTicket.id,
            text: `${ctx.user.name} sent a message.`,
          },
        });
      }

      // Create attachment if exists.
      if (!!newMessage && !!attachmentUrl && attachmentUrl.length > 0) {
        for (const url of attachmentUrl) {
          await db.attachment.create({
            data: {
              url,
              name: `${url.split(".").pop()?.toUpperCase()!}`,
              messageId: newMessage.id,
            },
          });
        }

        // Create a single log for all attachments.
        await db.log.create({
          data: {
            ticketId: newTicket.id,
            text: `${ctx.user.name} added ${attachmentUrl.length} file${
              attachmentUrl.length === 1 ? "" : "s"
            }.`,
          },
        });
      }

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
          text: `Ticket assigned to ${updatedTicket.agent?.name}.`,
          ticketId: updatedTicket.id,
        },
      });

      return updatedTicket;
    }),

  /**
   * PRIVATE: Create message. Allows ticket owner and
   * agents to send a message, tied to the ticket.
   */
  createMessage: privateProcedure
    .input(
      z.object({
        content: z.string().min(1),
        ticketId: z.string().min(1),
        attachmentUrl: z.array(z.string()).nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { content, ticketId, attachmentUrl } = input;

      const existingTicket = await db.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true },
      });

      if (!existingTicket)
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });

      if (
        !(ctx.user.role === "ADMIN" || ctx.user.role === "AGENT") &&
        ctx.user.email !== existingTicket.user.email
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Only ticket owner and helpdesk can send messages retated to the ticket",
        });

      if (!!attachmentUrl && attachmentUrl.length > 5)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum 5 files allowed",
        });

      const message = await db.message.create({
        data: {
          content,
          ticketId,
          userEmail: ctx.user.email,
        },
      });

      if (!!message) {
        await db.log.create({
          data: {
            ticketId,
            text: `${ctx.user.name} sent a message.`,
          },
        });
      }

      if (!!message && !!attachmentUrl && attachmentUrl.length > 0) {
      }
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
          messages: {
            include: { user: true, attachments: true },
          },
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
