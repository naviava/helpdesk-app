import { privateProcedure } from "@/server/trpc";

export const getUserTickets = privateProcedure.query(({ ctx }) => {});

export const getAllTickets = privateProcedure.query(({ ctx }) => {});
