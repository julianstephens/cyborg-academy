import {
  Link as ChakraLink,
  Collapsible,
  Flex,
  For,
  List,
  Show,
  Text,
} from "@chakra-ui/react";
import type { Seminar } from "cyborg-utils";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router";

export const SeminarDisplay = ({ data }: { data: Seminar }) => {
  return (
    <Collapsible.Root
      w={{ base: "full", lg: "3/4" }}
      border="1px solid white"
      borderRadius="lg"
      px="4"
    >
      <Collapsible.Trigger
        fontSize={{ base: "xl", lg: "3xl" }}
        w="full"
        h="14"
        cursor="pointer"
        asChild
      >
        <Flex justify="space-between" align="center">
          <ChakraLink
            variant="underline"
            transition="ease"
            transitionDuration="moderate"
            _hover={{ textDecorationColor: "blue.200", color: "blue.200" }}
            _disabled={{ pointerEvents: "none", textDecoration: "none" }}
            asChild
            aria-disabled="true"
          >
            <Link to={`/dashboard/${data.slug}`} state={data}>
              <Text>{data.title}</Text>
            </Link>
          </ChakraLink>
          <FaAngleDown />
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content fontSize={{ base: "lg", lg: "2xl" }} pb="4">
        {data.description && <Text mb="4">{data.description}</Text>}
        <hr />
        <Show
          when={data.sessions && data.sessions.length > 0}
          fallback={<Text>No seminar sessions scheduled yet</Text>}
        >
          <Flex direction="column" mt="2">
            <Text>Sessions:</Text>
            <List.Root listStyle="inside">
              <For each={data.sessions}>
                {(item) => <List.Item key={item.id}>{item.title}</List.Item>}
              </For>
            </List.Root>
          </Flex>
        </Show>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
