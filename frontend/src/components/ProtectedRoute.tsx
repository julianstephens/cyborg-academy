import { useCurrentUser } from "@/queries";
import type { ChildrenProps } from "@/types";
import React from "react";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: ChildrenProps) => {
  const { data: user, isError } = useCurrentUser();

  if (!user || !user.data || isError) return <Navigate to="/" replace />;

  children = React.Children.map(children, (el) => {
    return React.cloneElement(el as React.ReactElement, { user: user.data });
  });
  return children;
};
