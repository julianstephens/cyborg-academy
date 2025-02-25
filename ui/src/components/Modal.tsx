import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChildrenProps } from "@/types";
import { Button } from "@chakra-ui/react";

export const Modal = ({
  title,
  children,
}: ChildrenProps & { title: string }) => (
  <DialogRoot size="lg" placement="center" motionPreset="slide-in-bottom">
    <DialogTrigger asChild>
      <Button variant="outline" size="sm">
        {title}
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogCloseTrigger />
      </DialogHeader>
      <DialogBody
        id="dialogueBody"
        display="flex"
        flexDirection="column"
        justifyItems="center"
        alignItems="center"
        w="full"
        p="6"
      >
        {children}
      </DialogBody>
    </DialogContent>
  </DialogRoot>
);
