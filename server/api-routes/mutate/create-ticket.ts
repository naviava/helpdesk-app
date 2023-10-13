import * as z from "zod";
import { TRPCError } from "@trpc/server";

import { PriorityEnum } from "@/types";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { generateRefId } from "@/lib/generate-ref-id";

export const createTicket = privateProcedure
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
  });
