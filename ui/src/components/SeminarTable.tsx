import { deleteSeminar as deleteHandler } from "@/api-handlers";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import queryClient from "@/query-client";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Show,
  Spinner,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { isAPIError, Seminar } from "cyborg-utils";
import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

const DeleteButton = ({ seminar }: { seminar: Seminar }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const deleteSeminar = async () => {
    setLoading(true);
    try {
      await deleteHandler(seminar.slug);
      await queryClient.invalidateQueries({
        queryKey: [`${import.meta.env.VITE_API_URL}/seminars`],
      });
      setLoading(false);
      toast.success(`Seminar '${seminar.title}' has been deleted!`, {
        toastId: "deleteSucccess",
      });
    } catch (err) {
      setLoading(false);
      toast.error(isAPIError(err) ? err.message : "Unable to delete seminar", {
        toastId: "deleteErr",
      });
    }
  };

  return (
    <PopoverRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <PopoverTrigger asChild>
        <IconButton size="xs" variant="outline" colorPalette="red">
          <FaTrash />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Stack gap="4">
            <Show
              when={!isLoading}
              fallback={
                <Flex w="full" align="center" justify="center">
                  <Spinner />
                </Flex>
              }
            >
              <Text fontSize="lg">
                You are about to{" "}
                <span style={{ fontWeight: "bold" }}>permanently delete</span>{" "}
                <span style={{ fontStyle: "italic" }}>{seminar.title}</span> and
                all of it sessions.
              </Text>
            </Show>
            <Button
              colorPalette="red"
              onClick={deleteSeminar}
              disabled={isLoading}
            >
              Confirm Deletion
            </Button>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export const SeminarTable = ({ seminars }: { seminars: Seminar[] }) => {
  const rows = seminars.map((s) => (
    <Table.Row key={s.id}>
      <Table.Cell>{s.id}</Table.Cell>
      <Table.Cell>{s.title}</Table.Cell>
      <Table.Cell>{s.description ?? "N/A"}</Table.Cell>
      <Table.Cell>{s.sessions ? s.sessions.length : 0}</Table.Cell>
      <Table.Cell>
        <HStack gap="4">
          <DeleteButton seminar={s} />
        </HStack>
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <Table.Root variant="outline">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>ID</Table.ColumnHeader>
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Number of Sessions</Table.ColumnHeader>
          <Table.ColumnHeader>Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>{rows}</Table.Body>
    </Table.Root>
  );
};
