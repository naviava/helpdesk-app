import z from "zod";
import { hash } from "bcrypt";
import { TRPCError } from "@trpc/server";

import { db } from "@/lib/db";
import {
  publicProcedure,
  privateProcedure,
  adminProcedure,
  managerProcedure,
  router,
} from "@/server/trpc";
import { getServerSession } from "next-auth";

export const appRouter = router({
  // Get user profile API.
  getUserProfile: publicProcedure.query(async () => {
    const session = await getServerSession();
    if (!session || !session?.user || !session.user.email) return null;

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    return user;
  }),

  // User registration mutation API.
  registerUser: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1)
          .max(50)
          .regex(new RegExp(/^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/)),
        email: z.string().email(),
        password: z
          .string()
          .min(6)
          .regex(
            new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/),
          ),
        confirmPassword: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      const { name, email, password, confirmPassword } = input;

      // Checks if the email already exists.
      const existingUser = await db.user.findUnique({
        where: { email },
      });
      if (!!existingUser)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with that email already exists",
        });

      // Checks if both passwords are the same.
      if (password !== confirmPassword)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The passwords did not match",
        });

      // Hash the password and create user, if email address is unique.
      const hashedPassword = await hash(password, 10);
      await db.user.create({
        data: { name, email, hashedPassword },
      });

      return true;
    }),

  // Get All ticket categories API.
  getTicketCategories: privateProcedure.query(async () => {
    const categories = await db.ticketCategory.findMany({});
    return categories;
  }),

  // Get All request categories API.
  getRequestCategories: privateProcedure.query(async () => {
    const categories = await db.requestCategory.findMany({});
    return categories;
  }),

  // Get all departments API.
  getDepartments: privateProcedure.query(async () => {
    const departments = await db.department.findMany({});
    return departments;
  }),
});

export type AppRouter = typeof appRouter;
