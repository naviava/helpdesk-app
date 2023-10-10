import { db } from "@/lib/db";
import { TRPCError, initTRPC } from "@trpc/server";
import { getServerSession } from "next-auth";

const t = initTRPC.create();
const middleware = t.middleware;

// Logged in users only middleware.
const isAuthenticated = middleware(async (opts) => {
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized action",
    });

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized action",
    });

  return opts.next({
    ctx: {
      user: { name: user.name, email: user.email, image: user.image },
    },
  });
});

const isAdmin = middleware(async (opts) => {
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized action",
    });

  const user = await db.user.findUnique({
    where: { email: session.user.email, role: "ADMIN" },
  });

  if (!user)
    throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden action" });

  return opts.next({
    ctx: {
      user: { name: user.name, email: user.email, image: user.image },
    },
  });
});

// Manager and Admin only middleware.
const isManager = middleware(async (opts) => {
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Unauthorized action",
    });

  const user = await db.user.findUnique({
    where: {
      email: session.user.email,
      role: {
        in: ["ADMIN", "MANAGER"],
      },
    },
  });

  if (!user)
    throw new TRPCError({ code: "FORBIDDEN", message: "Forbidden action" });

  return opts.next({
    ctx: {
      user: { name: user.name, email: user.email, image: user.image },
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin);
export const managerProcedure = t.procedure.use(isManager);
export const privateProcedure = t.procedure.use(isAuthenticated);