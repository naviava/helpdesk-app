import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import { privateProcedure, router } from "@/server/trpc";

export const listRouter = router({
  // PRIVATE: Get All ticket categories API.
  getTicketCategories: privateProcedure.query(async ({ ctx }) => {
    const categories = await db.ticketCategory.findMany({});

    if (!categories)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No categories found.",
      });

    return categories;
  }),

  // PRIVATE: Get all departments API.
  getDepartments: privateProcedure.query(async ({ ctx }) => {
    const departments = await db.department.findMany({});

    if (!departments)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No departments found.",
      });

    return departments;
  }),
});
