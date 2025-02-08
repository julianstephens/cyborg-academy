import * as handlers from "@/api-handlers";
import type { APIError, ResponseObject, Seminar, User } from "cyborg-utils";
import { createQuery } from "react-query-kit";

export const useCurrentUser = createQuery<ResponseObject<User>>({
  queryKey: ["/api/auth/me"],
  fetcher: handlers.getAuthMe,
});

export const useSeminars = createQuery<
  ResponseObject<Seminar[]>,
  null,
  APIError
>({
  queryKey: ["/api/seminars"],
  fetcher: handlers.getSeminars,
});

export const useSeminar = createQuery<
  ResponseObject<Seminar>,
  { slug: string },
  APIError
>({
  queryKey: ["/api/seminars"],
  fetcher: handlers.getSeminar,
});
