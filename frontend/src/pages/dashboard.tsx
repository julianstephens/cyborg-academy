import { SeminarDisplay } from "@/components/Seminar";
import { useSeminars } from "@/queries";
import { Flex, Heading, Spinner } from "@chakra-ui/react";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const { data, isError, isLoading, error } = useSeminars();

  if (isError) {
    toast.error(error.message, { theme: "dark", draggable: false });
  }

  return (
    <Flex w="full" h="full" mt="20" direction="column" align="center" gap="10">
      {!isError && data && data.data.length > 0 ? (
        data.data.map((d) => <SeminarDisplay key={d.id} data={d} />)
      ) : isLoading ? (
        <Spinner mt="20" size="lg" />
      ) : (
        <Heading mt="20" size="xl">
          No seminars to display
        </Heading>
      )}
    </Flex>
  );
};

export default DashboardPage;
