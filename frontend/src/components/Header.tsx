import { Avatar } from "@/components/ui/avatar";
import { UserProp } from "@/types";
import { Flex, Heading } from "@chakra-ui/react";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export const Header = ({ user }: UserProp) => {
  return (
    <Flex w="full" justify="space-between">
      <Heading>Cyborg Academy</Heading>
      {user && (
        <Avatar
          size="xl"
          name={user.username}
          colorPalette={pickPalette(user.username)}
          src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
        />
      )}
    </Flex>
  );
};
