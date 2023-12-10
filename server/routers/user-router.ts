import { z } from "zod";
import { hash } from "bcrypt";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { generateEmpId } from "@/lib/generate-id";
import { privateProcedure, publicProcedure, router } from "@/server/trpc";

export const userRouter = router({
  // PUBLIC: Get user profile API.
  getUserProfile: publicProcedure.query(async () => {
    const session = await getServerSession();
    if (!session || !session?.user || !session.user.email) return null;

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { department: true },
    });

    if (!user) return null;

    return {
      name: user.name,
      empId: user.empId,
      email: user.email,
      image: user.image,
      designation: user.designation,
      dob: user.dob,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      departmentId: user.departmentId,
      department: user.department?.name,
      role: user.role,
      disabled: user.disabled,
    };
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

  // PRIVATE: Create Employee ID.
  createEmployeeId: privateProcedure.mutation(async ({ ctx }) => {
    if (!!ctx.user.empId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "This user already has an Employee ID",
      });
    }

    let empId = generateEmpId();
    let existingEmpId = await db.user.findUnique({
      where: { empId },
    });

    while (!!existingEmpId) {
      empId = generateEmpId();
      existingEmpId = await db.user.findUnique({
        where: { empId },
      });
    }

    await db.user.update({
      where: { email: ctx.user.email },
      data: { empId },
    });
  }),

  // PRIVATE: Set Profile Image.
  setProfileImage: privateProcedure
    .input(
      z.object({
        url: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;

      await db.user.update({
        where: { email: ctx.user.email },
        data: { image: url },
      });

      return true;
    }),

  // Edit personal Information.
  editPersonalInfo: privateProcedure
    .input(
      z.object({
        name: z.string().min(1, { message: "Name cannot be empty" }),
        designation: z.string().nullish(),
        departmentId: z.string().nullish(),
        dob: z
          .string()
          .regex(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}|^$/),
        phoneNumber: z
          .string()
          .regex(
            /^(?![- ])(?!.*[- ]$)(?!.*[- ]{2,})[0-9 -]*$/,
            "ex. 413-203... or 413 203...",
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, departmentId, designation, dob, phoneNumber } = input;

      let dataQuery: any = {
        name,
        designation,
        phoneNumber,
        dob,
      };

      if (!!departmentId) {
        dataQuery = {
          ...dataQuery,
          department: {
            connect: { id: departmentId },
          },
        };
      }

      await db.user.update({
        where: { email: ctx.user.email },
        data: dataQuery,
      });

      return true;
    }),

  // Edit Bio.
  setBio: privateProcedure
    .input(
      z.object({
        bio: z.string().min(20),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.user.update({
        where: { email: ctx.user.email },
        data: { bio: input.bio },
      });
    }),

  // Get helpdesk agents list.
  getAgents: privateProcedure.query(async () => {
    const agents = await db.user.findMany({
      where: {
        role: {
          in: ["ADMIN", "AGENT"],
        },
      },
      select: {
        name: true,
        email: true,
      },
    });

    return agents;
  }),
});
