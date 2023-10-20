import { z } from "zod";
import { hash } from "bcrypt";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { publicProcedure, router } from "@/server/trpc";

export const userRouter = router({
  // PUBLIC: Get user profile API.
  getUserProfile: publicProcedure.query(async () => {
    try {
      const session = await getServerSession();
      if (!session || !session?.user || !session.user.email) return null;

      const user = await db.user.findUnique({
        where: { email: session.user.email },
        include: { department: true },
      });

      if (!user) return null;

      return {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        disabled: user.disabled,
        department: user.department?.name,
      };
    } catch (err) {
      console.log("[GET_USER_PROFILE_ERROR]", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal Error",
      });
    }
  }),

  // PUBLIC: User registration mutation API.
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
      try {
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
      } catch (err) {
        console.log("[REGISTER_USER_ERROR]", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal Error",
        });
      }
    }),
});
