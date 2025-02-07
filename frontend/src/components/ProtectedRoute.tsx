import { useCurrentUser } from "@/queries";
import type { ChildrenProps } from "@/types";
import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export const ProtectedRoute = ({ children }: ChildrenProps) => {
  const { isLoggedIn } = useAuth();
  const { data } = useCurrentUser();

  if (!isLoggedIn()) return <Navigate to="/" replace />;

  children = React.Children.map(children, (el) => {
    return React.cloneElement(el as React.ReactElement, { user: data?.data });
  });
  return children;
};
