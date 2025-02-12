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
          size={{ base: "xl", lg: "3xl" }}
          _hover={{
            // color: "#EFCB68",
            color: "blue.200",
            textDecorationColor: "blue.200",
            transition: "ease",
            transitionDuration: "moderate",
          }}
        >
          {appName}
        </Heading>
      </Link>
      {user && (
        <MenuRoot positioning={{ placement: "bottom-end" }}>
          <MenuTrigger cursor="pointer" asChild>
            <Button variant="plain" border="none" outline="none">
              <Avatar
                size="2xl"
                name={user.username}
                colorPalette={pickPalette(user.username ?? "test")}
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
              />
            </Button>
          </MenuTrigger>
          <MenuContent mt="4">
            <MenuItem fontSize="xl" value="logout" onClick={logout}>
              Logout
            </MenuItem>
          </MenuContent>
        </MenuRoot>
      )}
    </Flex>
  );
};
