import { Avatar } from "@/components/ui/avatar";
import { Flex, Heading } from "@chakra-ui/react";
import { User } from "cyborg-types";

const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];

const pickPalette = (name: string) => {
  const index = name.charCodeAt(0) % colorPalette.length;
  return colorPalette[index];
};

export const Header = ({ user }: { user: User }) => {
  return (
    <Flex w="full" justify="space-between">
      <Heading>Cyborg Academy</Heading>
      <Avatar
        size="xl"
        name={user.username}
        colorPalette={pickPalette(user.username)}
        src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`}
      />
    </Flex>
  );
};
