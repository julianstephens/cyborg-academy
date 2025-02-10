import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { useAppInfo, useAuth } from "@/hooks";
import { UserProp } from "@/types";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export const Header = ({ user }: UserProp) => {
  const { logout } = useAuth();
  const { appName } = useAppInfo();
  return (
    <Flex w="full" mb="12" justify="space-between">
      <Link to="/">
        <Heading
          size="3xl"
          _hover={{
            // color: "#EFCB68",
            textDecoration: "underline",
            transition: "ease",
            transitionDuration: "moderate",
          }}
        >
          {appName}
        </Heading>
      </Link>
      {user && (
        <MenuRoot>
          <MenuTrigger cursor="pointer" asChild>
            <Button variant="plain" border="none" outline="none">
              <Avatar
                size="xl"
                name={user.username}
                colorPalette={pickPalette(user.username ?? "test")}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
              />
            </Button>
          </MenuTrigger>
          <MenuContent>
            <MenuItem value="logout" onClick={logout}>
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      )}
    </Flex>
  );
};
