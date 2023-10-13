import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure } from "@/server/trpc";

export const getTicketCategories = privateProcedure.query(async ({ ctx }) => {
  try {
    const categories = await db.ticketCategory.findMany({});
    return categories;
  } catch (err) {
    console.log("[GET_TICKET_CATEGORIES_ERROR]", err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Error",
    });
  }
});

export const getRequestCategories = privateProcedure.query(async ({ ctx }) => {
  try {
    const categories = await db.requestCategory.findMany({});
    return categories;
  } catch (err) {
    console.log("[GET_REQUEST_CATEGORIES_ERROR]", err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Error",
    });
  }
});

export const getDepartments = privateProcedure.query(async ({ ctx }) => {
  try {
    const departments = await db.department.findMany({});
    return departments;
  } catch (err) {
    console.log("[GET_DEPARTMENTS_ERROR]", err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Error",
    });
  }
});
