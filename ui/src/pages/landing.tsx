import { useAppInfo, useAuth } from "@/hooks";
import { Button, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";

const LandingPage = () => {
  const { appName, appDescription } = useAppInfo();
  const [title, setTitle] = useState("");
  const [searchParams] = useSearchParams();
  const { isAuthenticated, checkedAuthStatus, login } = useAuth();
  const goto = useNavigate();

  const doLogin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    try {
      await login();
    } catch {
      toast.error("Unable to login. Please try again.", {
        toastId: "loginErr",
      });
    }
  };

  useEffect(() => {
    if (checkedAuthStatus && isAuthenticated) goto("/dashboard");
  }, [isAuthenticated, checkedAuthStatus, goto]);

  useEffect(() => {
    setTitle(appName);
  }, [appName]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) {
      toast.error(err, { toastId: "serverErr" });
    }
  }, []);

  return (
    <Flex
      w="full"
      h="full"
      direction="column"
      justify="center"
      align="center"
      gap="6"
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={appDescription} />
      </Helmet>
      <Heading size="3xl">{appName}</Heading>
      <Button w={{ base: "xs", lg: "md" }} onClick={doLogin}>
        Login
      </Button>
    </Flex>
  );
};

export default LandingPage;
