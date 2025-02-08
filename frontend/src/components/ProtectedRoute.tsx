import { useAuth } from "@/components/AuthContext";
import { Header } from "@/components/Header";
import { useCurrentUser } from "@/queries";
import type { ChildrenProps } from "@/types";
import { Flex } from "@chakra-ui/react";
import type { User } from "cyborg-utils";
import React from "react";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: ChildrenProps) => {
  const { isLoggedIn } = useAuth();
  const { data } = useCurrentUser();

  if (!isLoggedIn()) return <Navigate to="/" replace />;

  children = React.Children.map(children, (el) => {
    return React.cloneElement(el as React.ReactElement, { user: data?.data });
  });
  return (
    <Flex w="full" h="full" direction="column">
      <Header user={data?.data ?? ({} as User)} />
      {children}
    </Flex>
  );
};
