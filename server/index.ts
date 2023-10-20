import { router } from "@/server/trpc";

import { userRouter } from "./routers/user-router";
import { listRouter } from "./routers/list-router";
import { ticketRouter } from "./routers/ticket-router";

export const appRouter = router({
  user: userRouter,
  list: listRouter,
  ticket: ticketRouter,
});

export type AppRouter = typeof appRouter;
