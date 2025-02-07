import { Header } from "@/components/Header";
import { SeminarDisplay } from "@/components/Seminar";
import { useSeminars } from "@/queries";
import { UserProp } from "@/types";
import { Flex, Heading } from "@chakra-ui/react";

const DashboardPage = ({ user }: UserProp) => {
  const { data, isError } = useSeminars();

  return (
    <Flex w="full" h="full" direction="column">
      <Header user={user} />
      <Flex
        w="full"
        h="full"
        marginTop="20"
        direction="column"
        align="center"
        gap="10"
      >
        {!isError && data ? (
          data.data.map((d) => <SeminarDisplay key={d.id} data={d} />)
        ) : (
          <Heading size="xl">No seminars to display</Heading>
        )}
      </Flex>
    </Flex>
  );
};

export default DashboardPage;
