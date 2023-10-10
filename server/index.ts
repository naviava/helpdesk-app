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

export const appRouter = router({
  getUserProfile: privateProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: { email: ctx.user.email },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });
    return user;
  }),

  // User registration
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
            new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
          ),
        confirmPassword: z.string().min(6),
      })
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
});

export type AppRouter = typeof appRouter;