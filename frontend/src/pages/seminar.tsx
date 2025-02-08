import { SessionDisplay } from "@/components/Session";
import { Flex, For, Heading, Text } from "@chakra-ui/react";
import type { Seminar } from "cyborg-utils";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

const SeminarPage = () => {
  const location = useLocation();
  const seminar: Seminar = location.state;

  if (!seminar) toast.error("Something went wrong getting this seminar :(");

  return (
    <>
      {seminar ? (
        <Flex w="full" h="full" align="center" direction="column">
          <Heading size="2xl">{seminar.title}</Heading>
          {seminar.description && <Text mt="4">{seminar.description}</Text>}
          {seminar.sessions && seminar.sessions.length > 0 && (
            <Flex direction="column" w="full" h="full" mt="10" mb="6" gap="6">
              <For each={seminar.sessions}>
                {(item) => <SessionDisplay key={item.id} data={item} />}
              </For>
            </Flex>
          )}
          <Text justifySelf="flex-end" mx="auto" mb="4" color="gray.500">
            Last updated {new Date(seminar.updatedAt * 1000).toLocaleString()}
          </Text>
        </Flex>
      ) : (
        <Text>Nothing to see here</Text>
      )}
    </>
  );
};

export default SeminarPage;
