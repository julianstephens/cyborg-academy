import { SessionDisplay } from "@/components/Session";
import { useAppInfo, useSeminar } from "@/hooks";
import { Flex, For, Heading, Show, Spinner, Text } from "@chakra-ui/react";
import { type Seminar, isEmpty } from "cyborg-utils";
import { useEffect, useState } from "react";
// import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const SeminarPage = () => {
  const { appName } = useAppInfo();
  const { slug } = useParams();
  const [seminar, setSeminar] = useState<Seminar>();
  const [title, setTitle] = useState("Seminar");
  const [seminarSlug, setSeminarSlug] = useState("");
  const goto = useNavigate();

  const { data, isError, isLoading } = useSeminar({
    variables: { slug: seminarSlug },
  });

  if (isError)
    toast.error("Something went wrong getting this seminar :(", {
      toastId: "seminarErr",
    });

  useEffect(() => {
    if (slug) {
      setSeminarSlug(slug);
    } else {
      toast.error("Something went wrong displaying seminar");
      goto("/dashboard");
    }
  }, [slug]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (data && data.data) {
      setSeminar(data.data);
      setTitle(`${appName} | ${data.data.title}`);
    }
  }, [data, appName]);

  return (
    <>
      {seminar ? (
        <Flex
          id="seminarContainer"
          w="full"
          h="full"
          align="center"
          direction="column"
        >
          {/* <Helmet> */}
          {/*   <title>{title}</title> */}
          {/*   <Show when={seminar.description}> */}
          {/*     <meta name="description" content={seminar.description} /> */}
          {/*   </Show> */}
          {/* </Helmet> */}
          <Heading size="3xl" textAlign="center">
            {seminar.title}
          </Heading>
          {seminar.description && <Text mt="4">{seminar.description}</Text>}
          <Show
            when={
              seminar.sessions &&
              seminar.sessions.length > 0 &&
              !isEmpty(seminar.sessions[0])
            }
            fallback={
              <Text my="auto" fontSize="lg">
                No published sessions
              </Text>
            }
          >
            <Flex direction="column" w="full" h="full" mt="10" mb="6" gap="6">
              <For each={seminar.sessions}>
                {(item) => <SessionDisplay key={item.id} data={item} />}
              </For>
            </Flex>
          </Show>
          <Text mt="auto" mx="auto" mb="4" color="gray.500">
            Last updated {new Date(seminar.updatedAt * 1000).toLocaleString()}
          </Text>
        </Flex>
      ) : isLoading ? (
        <Flex w="full" h="full" align="center" justify="center">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Text>Nothing to see here</Text>
      )}
    </>
  );
};

export default SeminarPage;
