import { Header } from "@/components/Header";
import { UserProp } from "@/types";
import { Flex } from "@chakra-ui/react";

const DashboardPage = ({ user }: UserProp) => {
  return (
    <Flex direction="column">
      <Header user={user} />
    </Flex>
  );
};

export default DashboardPage;
