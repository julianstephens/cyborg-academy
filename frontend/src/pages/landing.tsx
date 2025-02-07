import { useAuth } from "@/components/AuthContext";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const { isLoggedIn, login } = useAuth();
  const goto = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) goto("/dashboard");
  }, [isLoggedIn, goto]);

  return (
    <Flex
      w="full"
      h="full"
      direction="column"
      justify="center"
      align="center"
      gap="6"
    >
      <Heading size="3xl">Cyborg Academy</Heading>
      <Button w="md" onClick={login}>
        Login
      </Button>
    </Flex>
  );
};

export default LandingPage;
