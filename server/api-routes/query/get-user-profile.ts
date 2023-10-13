import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { publicProcedure } from "@/server/trpc";

export const getUserProfile = publicProcedure.query(async () => {
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
});
