import { Avatar } from "@/components/ui/avatar";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { UserProp } from "@/types";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export const Header = ({ user }: UserProp) => {
  const { logout } = useAuth();
  return (
    <Flex w="full" justify="space-between">
      <Heading size="3xl">Cyborg Academy</Heading>
      {user && (
        <MenuRoot>
          <MenuTrigger cursor="pointer" asChild>
            <Button variant="plain" border="none" outline="none">
              <Avatar
                size="xl"
                name={user.username}
                colorPalette={pickPalette(user.username)}
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
