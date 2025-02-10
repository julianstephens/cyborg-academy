import { Header } from "@/components/Header";
import { useAuth } from "@/hooks";
import type { ChildrenProps } from "@/types";
import { Flex } from "@chakra-ui/react";
import type { User } from "cyborg-utils";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export const ProtectedRoute = ({ children }: ChildrenProps) => {
  const goto = useNavigate();
  const { isAuthenticated, user, checkedAuthStatus } = useAuth();

  useEffect(() => {
    if (checkedAuthStatus && !isAuthenticated) goto("/");
  }, [checkedAuthStatus, isAuthenticated]);

  children = React.Children.map(children, (el) =>
    React.cloneElement(el as React.ReactElement, {
      user: user ?? ({} as User),
    }),
  );
  return (
    <Flex w="full" h="full" direction="column">
      <Header user={user ?? ({} as User)} />
      {children}
    </Flex>
  );
};
