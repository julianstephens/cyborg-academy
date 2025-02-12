import { SeminarDisplay } from "@/components/Seminar";
import { useAppInfo, useSeminars } from "@/hooks";
import { Flex, Heading, Show, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const { appName } = useAppInfo();
  const [title, setTitle] = useState("Dashboard");
  const { data, isError, isLoading, error } = useSeminars();

  if (isError) {
    toast.error(error.message, {
      toastId: "seminarsErr",
    });
  }

  useEffect(() => {
    setTitle(`${appName} | Dashboard`);
  }, [appName]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Show when={!isError} fallback={<Text>Something went wrong :(</Text>}>
      <Flex
        w="full"
        h="full"
        mt="20"
        direction="column"
        align="center"
        gap="10"
      >
        <Helmet>
          <title>{title}</title>
          <meta name="description" content="Everything we've learned about" />
        </Helmet>
        {!isError && data && data.data && data.data.length > 0 ? (
          data.data.map((d) => <SeminarDisplay key={d.id} data={d} />)
        ) : isLoading ? (
          <Spinner mt="20" size="lg" />
        ) : (
          <Heading mt="20" size="xl">
            No seminars to display
          </Heading>
        )}
      </Flex>
    </Show>
  );
};

export default DashboardPage;
