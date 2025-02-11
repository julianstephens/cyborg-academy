import * as handlers from "@/api-handlers";
import type { AppInfo, AuthProps } from "@/types";
import type { APIError, ResponseObject, Seminar } from "cyborg-utils";
import { createContext, useContext, useState } from "react";
import { createQuery } from "react-query-kit";

export const useSeminars = createQuery<
  ResponseObject<Seminar[]>,
  null,
  APIError
>({
  queryKey: [`${import.meta.env.VITE_API_URL}/seminars`],
  fetcher: handlers.getSeminars,
});

export const useSeminar = createQuery<
  ResponseObject<Seminar>,
  { slug: string },
  APIError
>({
  queryKey: [`${import.meta.env.VITE_API_URL}/seminars`],
  fetcher: handlers.getSeminar,
});

export const useAppInfo = (): AppInfo => {
  const [appName] = useState("Cyborg Academy");
  const [appDescription] = useState("The official academy for cyborgs");

  return {
    appName,
    appDescription,
  };
};

export const AuthContext = createContext({} as AuthProps);
export const useAuth = () => {
  return useContext(AuthContext);
};
