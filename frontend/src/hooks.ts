import * as handlers from "@/api-handlers";
import type { AppInfo, AuthProps } from "@/types";
import type { APIError, ResponseObject, Seminar, User } from "cyborg-utils";
import { createContext, useContext, useState } from "react";
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
  queryKey: [
    `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}/seminars`,
  ],
  fetcher: handlers.getSeminars,
});

export const useSeminar = createQuery<
  ResponseObject<Seminar>,
  { slug: string },
  APIError
>({
  queryKey: [
    `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}/seminars`,
  ],
  fetcher: handlers.getSeminar,
});

export const useAppInfo = (): AppInfo => {
  const [apiUrl] = useState(
    `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}`,
  );
  const [appName] = useState("Cyborg Academy");
  const [appDescription] = useState("The official academy for cyborgs");

  return {
    apiUrl,
    appName,
    appDescription,
  };
};

export const AuthContext = createContext({} as AuthProps);
export const useAuth = () => {
  return useContext(AuthContext);
};
