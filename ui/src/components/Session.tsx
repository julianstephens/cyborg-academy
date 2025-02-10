import { Collapsible, Flex, Show, Text } from "@chakra-ui/react";
import type { SeminarSession } from "cyborg-utils";
import { FaAngleDown, FaLock } from "react-icons/fa6";

export const SessionDisplay = ({ data }: { data: SeminarSession }) => {
  return (
    <Collapsible.Root
      w="3/4"
      mx="auto"
      px="4"
      border="1px solid white"
      borderRadius="lg"
      disabled={data.locked}
      color={data.locked ? "gray.500" : "white"}
    >
      <Collapsible.Trigger
        w="full"
        h="14"
        cursor={data.locked ? "default" : "pointer"}
        asChild
      >
        <Flex justify="space-between" align="center">
          <Text>{data.title}</Text>
          {data.locked ? <FaLock /> : <FaAngleDown />}
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content pb="4">
        <Text mb="4">{data.description}</Text>
        <Show when={data.notes || data.readings}>
          <hr />{" "}
        </Show>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
