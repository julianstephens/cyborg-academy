import * as handlers from "@/api-handlers";
import { ResponseObject, User } from "cyborg-utils";
import { createQuery } from "react-query-kit";

export const useCurrentUser = createQuery<ResponseObject<User>>({
  queryKey: ["/api/auth/me"],
  fetcher: handlers.getAuthMe,
});
