import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure, router } from "@/server/trpc";

export const listRouter = router({
  // PRIVATE: Get All ticket categories API.
  getTicketCategories: privateProcedure.query(async ({ ctx }) => {
    const categories = await db.ticketCategory.findMany({});
    return categories;
  }),

  // PRIVATE: Get All request categories API.
  getRequestCategories: privateProcedure.query(async ({ ctx }) => {
    const categories = await db.requestCategory.findMany({});
    return categories;
  }),

  // PRIVATE: Get all departments API.
  getDepartments: privateProcedure.query(async ({ ctx }) => {
    const departments = await db.department.findMany({});
    return departments;
  }),
});
