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

const ResourceList = ({
  data,
  title,
}: {
  data?: RemoteResource[];
  title: string;
}) => (
  <Show when={data}>
    <Flex direction="column" mt={{ base: "4", xl: "unset" }}>
      <Text mb="2" fontWeight="bold" fontSize="lg">
        {title}
      </Text>
      <List.Root listStyle="inside">
        <For each={data}>
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
);

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
  }, [data.readings]);

  return (
    <>
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
            <ResourceList
              data={groupedReadings.essential}
              title="Essential Readings"
            />
            <ResourceList
              data={groupedReadings.supplemental}
              title="Supplemental Readings"
            />
            <ResourceList data={data.notes} title="Notes" />
          </Flex>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};
