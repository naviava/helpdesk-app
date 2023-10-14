import * as z from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

export const getUserTickets = privateProcedure.query(({ ctx }) => {});

export const getAllTickets = privateProcedure
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
  });
