import {
  Collapsible,
  Flex,
  For,
  Link,
  List,
  Show,
  Text,
} from "@chakra-ui/react";
import { groupByKey, RemoteResource, type SeminarSession } from "cyborg-utils";
import { useEffect, useState } from "react";
import { FaAngleDown, FaLock } from "react-icons/fa6";

export const SessionDisplay = ({ data }: { data: SeminarSession }) => {
  const [groupedReadings, setReadings] = useState<{
    essential?: RemoteResource[];
    supplemental?: RemoteResource[];
  }>({});

  useEffect(() => {
    if (data.readings) {
      const grouped = groupByKey(data.readings, "essential");
      // @ts-expect-error 2538
      grouped["essential"] = grouped[true];
      // @ts-expect-error 2538
      grouped["supplemental"] = grouped[false];
      // @ts-expect-error 2538
      delete grouped[true];
      // @ts-expect-error 2538
      delete grouped[false];
      setReadings(grouped);
    }
  }, []);

  return (
    <Collapsible.Root
      w={{ base: "full", lg: "3/4" }}
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
          <Text fontSize="xl">{data.title}</Text>
          {data.locked ? <FaLock /> : <FaAngleDown />}
        </Flex>
      </Collapsible.Trigger>
      <Collapsible.Content pb="4">
        <Text mb="4">{data.description}</Text>
        <Show when={data.notes || data.readings}>
          <hr />
        </Show>
        <Flex
          direction={{ base: "column", xl: "row" }}
          justify={{ xl: "space-around" }}
          align={{ xl: "center" }}
          pt="4"
        >
          <Show when={groupedReadings.essential}>
            <Flex direction="column">
              <Text mb="2" fontWeight="bold" fontSize="lg">
                Essential Readings
              </Text>
              <List.Root listStyle="inside">
                <For each={groupedReadings.essential}>
                  {(item) => (
                    <List.Item key={item.name}>
                      <Link
                        href={item.url}
                        target="_blank"
                        _hover={{ color: "blue.200" }}
                      >
                        {item.name}
                      </Link>
                    </List.Item>
                  )}
                </For>
              </List.Root>
            </Flex>
          </Show>
          <Show when={groupedReadings.supplemental}>
            <Flex direction="column" mt={{ base: "4", xl: "unset" }}>
              <Text mb="2" fontWeight="bold" fontSize="lg">
                Supplemental Readings
              </Text>
              <List.Root listStyle="inside">
                <For each={groupedReadings.supplemental}>
                  {(item) => (
                    <List.Item key={item.name}>
                      <Link
                        href={item.url}
                        target="_blank"
                        _hover={{ color: "blue.200" }}
                      >
                        {item.name}
                      </Link>
                    </List.Item>
                  )}
                </For>
              </List.Root>
            </Flex>
          </Show>
          <Show when={data.notes}>
            <Text mt="4" mb="2" fontSize="lg">
              Notes
            </Text>
            <List.Root listStyle="inside">
              <For each={data.notes}>
                {(item) => (
                  <List.Item>
                    <Link
                      href={item.url}
                      target="_blank"
                      _hover={{ color: "blue.200" }}
                    >
                      {item.name}
                    </Link>
                  </List.Item>
                )}
              </For>
            </List.Root>
          </Show>
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
