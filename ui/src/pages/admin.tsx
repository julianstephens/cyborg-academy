import { Modal } from "@/components/Modal";
import { SeminarForm } from "@/components/SeminarForm";
import { SeminarTable } from "@/components/SeminarTable";
import { SessionForm } from "@/components/SessionForm";
import { useAppInfo, useSeminars } from "@/hooks";
import { Flex, Heading, Show, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";

const AdminPage = () => {
  const { appName } = useAppInfo();
  const [title, setTitle] = useState("Admin");
  const { data, isError, isLoading } = useSeminars();
  const seminars = useMemo(() => {
    if (data && data.data && !isError) {
      return data.data.map((d) => ({ value: d.id, label: d.title }));
    }
    return undefined;
  }, [data]);

  useEffect(() => {
    setTitle(`${appName} | Admin`);
  }, [appName]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content="Admin dashboard for content management"
        />
      </Helmet>
      <Flex direction="column" w="full" h="full">
        <Heading textAlign="center" fontSize={{ base: "xl", lg: "2xl" }}>
          Admin Page
        </Heading>
        <Flex w="full" justify="end" align="center" gap="4" mt="20">
          <Modal title="Create Seminar">
            <SeminarForm />
          </Modal>
          {!isLoading && !isError && seminars && (
            <Modal title="Create Seminar Session">
              <SessionForm seminars={seminars} />
            </Modal>
          )}
        </Flex>
        <Flex h="full" w="full" justify="center" align="center">
          <Show
            when={!isLoading && !isError && data}
            fallback={<Text>No seminars to display</Text>}
          >
            {/* @ts-expect-error chakra check ensures data */}
            <SeminarTable seminars={data?.data} />
          </Show>
        </Flex>
      </Flex>
    </>
  );
};

export default AdminPage;
