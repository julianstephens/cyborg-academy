import { Collapsible, Flex, List, Text } from "@chakra-ui/react";
import { Seminar } from "cyborg-utils";
import { FaAngleDown } from "react-icons/fa6";

export const SeminarDisplay = ({ data }: { data: Seminar }) => {
  return (
    <Collapsible.Root
      w="3/4"
      border="1px solid white"
      borderRadius="lg"
      paddingX="4"
    >
      <Collapsible.Trigger w="full" h="14" cursor="pointer" asChild>
        <Flex justify="space-between" align="center">
          <Text>{data.title}</Text>
          <FaAngleDown />
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content pb="4">
        <hr />
        {data.sessions && data.sessions.length > 0 ? (
          <Flex direction="column" mt="2">
            <Text>Sessions:</Text>
            <List.Root listStyle="inside">
              {data.sessions.map((s) => (
                <List.Item key={s.id}>{s.title}</List.Item>
              ))}
            </List.Root>
          </Flex>
        ) : (
          <Text>No seminar sessions scheduled yet</Text>
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
