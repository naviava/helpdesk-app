import { z } from "zod";
import {} from "dompurify";
import { TRPCError } from "@trpc/server";

import { PriorityEnum, StatusToggleEnum } from "@/types";

import { db } from "@/lib/db";
import { generateRefId } from "@/lib/generate-id";
import { privateProcedure, router } from "@/server/trpc";

export const ticketRouter = router({
  /**
   * CREATE TICKET PRIVATE MUTATION
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
        title: title,
        refId,
        priority,
        ownerEmail: ctx.user.email,
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
          senderEmail: ctx.user.email,
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
              url: url,
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
   * ASSIGN TICKET PRIVATE MUTATION:
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
          text:
            updatedTicket.agent?.email === ctx.user.email
              ? `${ctx.user.name} assigned the ticket to themself.`
              : `${ctx.user.name} assigned the ticket to ${updatedTicket.agent?.name}.`,
          ticketId: updatedTicket.id,
        },
      });

      return updatedTicket;
    }),

  /**
   * CREATE MESSAGE PRIVATE MUTATION:
   * Create message. Allows ticket owner and agents
   * to send a message, tied to the ticket.
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
        include: { owner: true },
      });

      if (!existingTicket)
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });

      if (
        !(ctx.user.role === "ADMIN" || ctx.user.role === "AGENT") &&
        ctx.user.email !== existingTicket.owner.email
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "Only ticket owner and helpdesk can send messages retated to the ticket",
        });

      if (existingTicket.status === "RESOLVED")
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket must be re-opened in order to send a message.",
        });

      if (!!attachmentUrl && attachmentUrl.length > 5)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Maximum 5 files allowed",
        });

      const message = await db.message.create({
        data: {
          content: content,
          ticketId,
          senderEmail: ctx.user.email,
        },
      });

      if (!!message) {
        await db.log.create({
          data: {
            ticketId,
            text: `${ctx.user.name} sent a message.`,
          },
        });

        await db.ticket.update({
          where: { id: ticketId },
          data: {
            status:
              existingTicket.owner.email === ctx.user.email
                ? "NEW_REPLY"
                : "WAITING_REPLY",
            updatedAt: new Date(Date.now()),
          },
        });
      }

      if (!!attachmentUrl && attachmentUrl.length > 0) {
        for (const url of attachmentUrl) {
          await db.attachment.create({
            data: {
              url: url,
              name: `${url.split(".").pop()?.toUpperCase() ?? "UNKNOWN"}`,
              messageId: message.id,
            },
          });
        }

        // Create a single log for all attachments.
        await db.log.create({
          data: {
            ticketId,
            text: `${ctx.user.name} added ${attachmentUrl.length} ${
              attachmentUrl.length === 1 ? "file." : "files."
            }`,
          },
        });
      }
    }),

  /**
   * TOGGLE STATUS PRIVATE MUTATION:
   * Switches ticket status based on input. When status
   * is RESOLVED, it can only receive the REOPENED status,
   * following which any status is accepted again.
   */
  toggleStatus: privateProcedure
    .input(
      z.object({
        ticketId: z.string().min(1),
        newStatus: StatusToggleEnum,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ticketId, newStatus } = input;

      const existingTicket = await db.ticket.findUnique({
        where: { id: ticketId },
        include: { owner: true },
      });
      if (!existingTicket)
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });

      if (
        !(ctx.user.role === "ADMIN" || ctx.user.role === "AGENT") &&
        ctx.user.email !== existingTicket.owner.email
      )
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only ticket owner and helpdesk can change ticket status",
        });

      let isRequestValid;
      if (existingTicket.status !== newStatus)
        isRequestValid =
          existingTicket.status === "RESOLVED"
            ? newStatus === "REOPENED"
            : newStatus !== "REOPENED";

      if (!isRequestValid)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not a valid status change",
        });

      await db.ticket.update({
        where: { id: ticketId },
        data: { status: newStatus },
      });

      const statusLogMap = {
        ON_HOLD: `${ctx.user.name} put the ticket on hold.`,
        RESOLVED: `${ctx.user.name} closed the ticket.`,
        REOPENED: `${ctx.user.name} re-opened the ticket.`,
      };

      await db.log.create({
        data: {
          ticketId,
          text: statusLogMap[newStatus],
        },
      });

      return true;
    }),

  /**
   * PRIVATE QUERY: Get all tickets API.
   */
  getAllTickets: privateProcedure.query(async ({ ctx }) => {
    const tickets = await db.ticket.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        owner: true,
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
   * PRIVATE QUERY: Get all resolved tickets API.
   */
  getResolvedTickets: privateProcedure.query(async ({ ctx }) => {
    const tickets = await db.ticket.findMany({
      where: { status: "RESOLVED" },
      orderBy: { updatedAt: "desc" },
      include: {
        owner: true,
        agent: true,
      },
    });

    if (!tickets)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No resolved tickets",
      });

    return tickets;
  }),

  /**
   * PRIVATE QUERY: Get unresolved tickets
   * created by logged in user.
   */
  getUserTickets: privateProcedure.query(async ({ ctx }) => {
    const tickets = await db.ticket.findMany({
      where: {
        ownerEmail: ctx.user.email,
        status: { not: "RESOLVED" },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        category: true,
        department: true,
        owner: true,
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
   * PRIVATE QUERY: Get all open tickets. Used for helpdesk.
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
        owner: true,
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
   * PRIVATE QUERY: Get assigned tickets. Used for helpdesk.
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
        owner: true,
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
   * PRIVATE QUERY: Get ticket by ID. Is only accessible
   * to helpdesk and the user who created the ticket.
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
        dataQuery = { id: input.id, ownerEmail: ctx.user.email };

      const ticket = await db.ticket.findUnique({
        where: dataQuery,
        include: {
          category: true,
          department: true,
          owner: true,
          agent: true,
          messages: {
            include: { sender: true, attachments: true },
            orderBy: { createdAt: "desc" },
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
   * PRIVATE QUERY: Get ticket logs.
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
