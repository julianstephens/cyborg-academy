import * as handlers from "@/api-handlers";
import { ResponseObject, Seminar, User } from "cyborg-utils";
import { createQuery } from "react-query-kit";

export const useCurrentUser = createQuery<ResponseObject<User>>({
  queryKey: ["/api/auth/me"],
  fetcher: handlers.getAuthMe,
});

export const useSeminars = createQuery<ResponseObject<Seminar[]>>({
  queryKey: ["/api/seminars"],
  fetcher: handlers.getSeminars,
});
