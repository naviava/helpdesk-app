import { router } from "@/server/trpc";
import { registerUser } from "./api-routes/mutate/register-user";
import { createTicket } from "./api-routes/mutate/create-ticket";
import { getUserProfile } from "./api-routes/query/get-user-profile";
import {
  getDepartments,
  getRequestCategories,
  getTicketCategories,
} from "./api-routes/query/get-list";

export const appRouter = router({
  // PUBLIC: Get user profile API.
  getUserProfile,

  // PUBLIC: User registration mutation API.
  registerUser,

  // PRIVATE: Get All ticket categories API.
  getTicketCategories,

  // PRIVATE: Get All request categories API.
  getRequestCategories,

  // PRIVATE: Get all departments API.
  getDepartments,

  /** PRIVATE: Create ticket API.
   *  Takes in title*, category, department,
   *  priority*(default: LOW), message*, attachment.
   */
  createTicket,
});

export type AppRouter = typeof appRouter;
