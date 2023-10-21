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

      if (!tickets) return [];

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
  getUserTickets: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { cursor } = input;
        const limit = input.limit ?? INFINITE_QUERY_LIMIT;

        const tickets = await db.ticket.findMany({
          take: limit + 1,
          where: {
            userEmail: ctx.user.email,
            status: { not: "RESOLVED" },
          },
          orderBy: { updatedAt: "desc" },
          cursor: cursor ? { id: cursor } : undefined,
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (tickets.length > limit) {
          const nextItem = tickets.pop();
          nextCursor = nextItem?.id;
        }

        return { tickets, nextCursor };
      } catch (err) {
        console.log("[GET_ALL_TICKETS_ERROR]", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error",
        });
      }
    }),
});
