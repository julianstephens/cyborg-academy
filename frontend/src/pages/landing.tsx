import { useCurrentUser } from "@/queries";
import { Badge, Button, Flex, Heading, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const LandingPage = () => {
  const { data: user } = useCurrentUser();
  const [msg, setMsg] = useState<string>();
  const [status, setStatus] = useState<number>();
  const goto = useNavigate();

  useEffect(() => {
    if (user && user.data) goto("/dashboard");
  }, [user, goto]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api");
        const data = await res.json();
        setMsg(data["message"]);
        setStatus(data["status"]);
      } catch (err: unknown) {
        console.log(err);
      }
    };
    fetchData();
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
      <Heading size="3xl">Cyborg Academy</Heading>
      <Link w="md" href="/api/auth/discord" target="_blank">
        <Button w="full">Login</Button>
      </Link>
      {msg && status && (
        <Badge colorPalette={status < 300 ? "green" : "red"}>{msg}</Badge>
      )}
    </Flex>
  );
};

export default LandingPage;
